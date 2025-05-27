import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { JobRequest } from './entities/job-request.entity';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { MailService } from '../mail/mail.service';
import { Worker } from '../worker/entities/worker.entity';
import { SmsService } from '../sms/sms.service';
import { generateOfferHash } from '../utils/offer-hash';
import { PublicOffersService } from '../public-offers/public-offers.service';
import { OfferAcceptanceLog } from '../public-offers/entities/offer-acceptance-log.entity';
import { LogUploaderService } from '../public-offers/log-uploader.service';

@Injectable()
export class JobRequestService {
  constructor(
    @InjectRepository(JobRequest)
    private readonly jobRequestRepository: Repository<JobRequest>,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly logUploaderService: LogUploaderService,

    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    private readonly publicOffersService: PublicOffersService,

    @InjectRepository(OfferAcceptanceLog)
    private readonly offerAcceptanceLogRepository: Repository<OfferAcceptanceLog>,
  ) {}

  async create(data: CreateJobRequestDto, ip: string): Promise<JobRequest> {
    if (!data.offerAccepted) {
      throw new BadRequestException(
        'Вы должны принять условия публичной оферты',
      );
    }

    const activeOffer = await this.publicOffersService.getActive();
    const offerContent = activeOffer.content;
    const offerVersion = activeOffer.version;
    const offerHash = generateOfferHash(offerContent);

    const jobRequest = this.jobRequestRepository.create({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      workDate: data.workDate,
      workTime: data.workTime,
      address: data.address,
      apartment: data.apartment,
      comments: data.comments,
      occupation: { id: data.occupationId },
      category: { id: data.categoryId },
      city: { id: data.cityId },
      clientIp: ip,
      offerAccepted: data.offerAccepted,
      offerAcceptedAt: new Date(),
      acceptedOfferVersion: offerVersion,
      acceptedOfferContent: offerContent,
      acceptedOfferHash: offerHash,
    });

    const savedJobRequest = await this.jobRequestRepository.save(jobRequest);

    await this.offerAcceptanceLogRepository.save({
      jobRequestId: savedJobRequest.id,
      offerVersion,
      offerContent,
      offerHash,
      clientIp: ip,
      clientEmail: data.email,
      clientPhone: data.phoneNumber,
    });

    await this.logUploaderService.uploadOfferAcceptanceLog({
      jobRequestId: savedJobRequest.id,
      email: data.email,
      phoneNumber: data.phoneNumber,
      offerVersion,
      offerContent,
      offerHash,
      clientIp: ip,
      address: savedJobRequest.address,
      apartment: savedJobRequest.apartment,
    });

    // 🔁 Подгружаем с occupation и category
    const fullJobRequest = await this.jobRequestRepository.findOne({
      where: { id: savedJobRequest.id },
      relations: ['occupation', 'category', 'city'],
    });

    if (!fullJobRequest) {
      throw new NotFoundException('JobRequest не найден после сохранения');
    }

    const matchedWorkers = await this.workerRepository.find({
      where: {
        occupation_id: data.occupationId,
        cityId: data.cityId,
        isActive: true,
      } as FindOptionsWhere<Worker>,
    });

    // ✅ Отправим email каждому работнику
    for (const worker of matchedWorkers) {
      if (!worker.email) continue;

      await this.mailService.sendJobRequestToWorker({
        email: worker.email,
        fullName: worker.fullName,
        workerId: worker.id,
        jobRequestId: savedJobRequest.id,
        workDate: savedJobRequest.workDate,
        workTime: savedJobRequest.workTime,
        address: savedJobRequest.address,
        occupationTitle: fullJobRequest.occupation.title,
        categoryTitle: fullJobRequest.category.title,
        cityName: fullJobRequest.city.name,
        price: fullJobRequest.category.price,
      });
    }

    if (data.email) {
      await this.mailService.sendClientWaitingEmail({
        email: data.email,
        name: data.name,
        workDate: data.workDate,
        workTime: data.workTime,
        categoryTitle: fullJobRequest.category.title,
        cityName: fullJobRequest.city.name,
        address: fullJobRequest.address,
        apartment: fullJobRequest.apartment,
        requestId: fullJobRequest.id,
        price: fullJobRequest.category.price,
      });
    }

    if (data.phoneNumber) {
      const formattedDate = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(data.workDate));

      const smsText =
        `✅ Ваша заявка принята!\n` +
        `${fullJobRequest.category.title}, ${fullJobRequest.city.name}\n` +
        `${formattedDate} в ${data.workTime}\n` +
        `Адрес: ${data.address}\n` +
        `Мы ищем специалиста — ожидайте.`;

      await this.smsService.sendSms(data.phoneNumber, smsText);
    }

    return savedJobRequest;
  }

  async book(jobRequestId: number, workerId: number): Promise<JobRequest> {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id: jobRequestId },
      relations: ['occupation', 'category'], // 👈 нужно, чтобы были доступны .title и .price
    });

    if (!jobRequest) {
      throw new NotFoundException(`Заявка с ID ${jobRequestId} не найдена`);
    }

    // Уже занята — уведомим
    if (jobRequest.booked_by) {
      const worker = await this.workerRepository.findOne({
        where: { id: workerId },
      });

      if (worker?.email) {
        await this.mailService.sendJobTakenNotification({
          email: worker.email,
          fullName: worker.fullName,
          jobRequestId: jobRequest.id,
        });
      }

      throw new BadRequestException(
        'Заявка уже забронирована другим работником',
      );
    }

    // Успешно бронируем
    jobRequest.booked_by = workerId;
    jobRequest.status = 'booked';

    const updatedRequest = await this.jobRequestRepository.save(jobRequest);

    const worker = await this.workerRepository.findOne({
      where: { id: workerId },
    });

    if (worker) {
      await this.mailService.sendBookingConfirmationToWorker({
        email: worker.email,
        fullName: worker.fullName,
        occupationTitle: updatedRequest.occupation.title,
        categoryTitle: updatedRequest.category.title,
        address: updatedRequest.address,
        workDate: updatedRequest.workDate,
        workTime: updatedRequest.workTime,
        clientPhone: updatedRequest.phoneNumber,
        price: updatedRequest.category.price,
        requestId: updatedRequest.id,
        apartment: updatedRequest.apartment,
      });
    }

    // Notify client via email and SMS
    if (worker && jobRequest.email) {
      await this.mailService.sendBookingInfoToClient({
        email: jobRequest.email,
        fullName: jobRequest.name,
        workerName: worker.fullName,
        workerPhone: worker.phoneNumber,
        workDate: updatedRequest.workDate,
        workTime: updatedRequest.workTime,
        occupationTitle: updatedRequest.occupation.title,
        categoryTitle: updatedRequest.category.title,
        address: updatedRequest.address,
        requestId: updatedRequest.id,
        price: updatedRequest.category.price,
      });
    }

    if (worker && jobRequest.phoneNumber) {
      const smsText =
        `✅ Ваша заявка №${updatedRequest.id} принята.\n` +
        `Исполнитель: ${worker.fullName}, ${worker.phoneNumber}\n` +
        `${updatedRequest.workDate} в ${updatedRequest.workTime}\n` +
        `Адрес: ${updatedRequest.address} кв ${updatedRequest.apartment}`;

      await this.smsService.sendSms(jobRequest.phoneNumber, smsText);
    }

    return updatedRequest;
  }

  async findAll(
    page = 1,
    limit = 10,
    cityId?: number,
    phoneNumber?: string,
    email?: string,
  ): Promise<{ data: JobRequest[]; total: number }> {
    const query = this.jobRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.occupation', 'occupation')
      .leftJoinAndSelect('request.category', 'category')
      .leftJoinAndSelect('request.city', 'city')
      .orderBy('request.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (cityId) {
      query.andWhere('request.city_id = :cityId', { cityId });
    }

    if (phoneNumber) {
      query.andWhere('request.phoneNumber ILIKE :phoneNumber', {
        phoneNumber: `%${phoneNumber}%`,
      });
    }

    if (email) {
      query.andWhere('request.email ILIKE :email', {
        email: `%${email}%`,
      });
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async updateRequest(
    id: number,
    updateData: Partial<JobRequest>,
  ): Promise<JobRequest> {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id },
    });

    if (!jobRequest) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    Object.assign(jobRequest, updateData);

    return this.jobRequestRepository.save(jobRequest);
  }

  async getOneRequest(id: number): Promise<JobRequest> {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id },
      relations: ['bookedBy'],
    });

    if (!jobRequest) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    return jobRequest;
  }

  async deleteRequest(id: number): Promise<void> {
    const result = await this.jobRequestRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }
  }

  async cancelRequest(jobRequestId: number): Promise<JobRequest> {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id: jobRequestId },
      relations: ['occupation', 'category', 'city'],
    });

    if (!jobRequest) {
      throw new NotFoundException(`Заявка с ID ${jobRequestId} не найдена`);
    }

    if (jobRequest.status === 'closed') {
      throw new BadRequestException('Заявка уже отменена');
    }

    jobRequest.status = 'closed';
    const updatedRequest = await this.jobRequestRepository.save(jobRequest);

    // Отправим рабочим email об отмене
    const matchedWorkers = await this.workerRepository.find({
      where: {
        occupation_id: jobRequest.occupation_id,
        cityId: jobRequest.city_id,
        isActive: true,
      } as FindOptionsWhere<Worker>,
    });

    for (const worker of matchedWorkers) {
      if (!worker.email) continue;

      await this.mailService.sendJobRequestCancellationToWorker({
        email: worker.email,
        fullName: worker.fullName,
        jobRequestId: jobRequest.id,
        occupationTitle: jobRequest.occupation.title,
        categoryTitle: jobRequest.category.title,
        cityName: jobRequest.city.name,
        workDate: jobRequest.workDate,
        workTime: jobRequest.workTime,
        address: jobRequest.address,
      });
    }

    // Уведомим клиента, если есть email
    if (jobRequest.email) {
      await this.mailService.sendClientCancellationEmail({
        email: jobRequest.email,
        fullName: jobRequest.name,
        jobRequestId: jobRequest.id,
        occupationTitle: jobRequest.occupation.title,
        categoryTitle: jobRequest.category.title,
        workDate: jobRequest.workDate,
        workTime: jobRequest.workTime,
        address: jobRequest.address,
      });
    }

    return updatedRequest;
  }
}
