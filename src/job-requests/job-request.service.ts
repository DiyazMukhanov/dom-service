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

  async createByClient(
    data: CreateJobRequestDto,
    ip: string,
  ): Promise<JobRequest> {
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
      house: data.house,
      apartment: data.apartment,
      comments: data.comments,
      occupation: { id: data.occupationId },
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
      clientPhone: data.phoneNumber,
      clientAddress: data.address,
      clientHouse: data.house,
      clientApartment: data.apartment,
    });

    await this.logUploaderService.uploadOfferAcceptanceLog({
      jobRequestId: savedJobRequest.id,
      phoneNumber: data.phoneNumber,
      offerVersion,
      offerContent,
      offerHash,
      clientIp: ip,
      address: savedJobRequest.address,
      house: savedJobRequest.house,
      apartment: savedJobRequest.apartment,
    });

    // 🔁 Подгружаем с occupation
    const fullJobRequest = await this.jobRequestRepository.findOne({
      where: { id: savedJobRequest.id },
      relations: ['occupation', 'city'],
    });

    if (!fullJobRequest) {
      throw new NotFoundException('JobRequest не найден после сохранения');
    }

    if (data.email) {
      await this.mailService.sendClientWaitingEmail({
        email: data.email,
        name: data.name,
        workDate: data.workDate,
        workTime: data.workTime,
        cityName: fullJobRequest.city.name,
        address: fullJobRequest.address,
        house: fullJobRequest.house,
        apartment: fullJobRequest.apartment,
        requestId: fullJobRequest.id,
        comments: fullJobRequest.comments,
      });
    }

    await this.mailService.sendNotificationToAdmin(savedJobRequest.id);

    return savedJobRequest;
  }

  async create(data: CreateJobRequestDto): Promise<JobRequest> {
    const jobRequest = this.jobRequestRepository.create({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      workDate: data.workDate,
      workTime: data.workTime,
      address: data.address,
      house: data.house,
      apartment: data.apartment,
      comments: data.comments,
      occupation: { id: data.occupationId },
      occupation_id: data.occupationId,
      city: { id: data.cityId },
      city_id: data.cityId,
      offerAccepted: false,
    });

    return this.jobRequestRepository.save(jobRequest);
  }

  generateOfferLink(jobRequest: JobRequest): string {
    const baseUrl = 'https://service-doma.kz/accept-offer';
    const query = new URLSearchParams({
      requestId: jobRequest.id.toString(),
      phone: jobRequest.phoneNumber,
      address: jobRequest.address,
      date: jobRequest.workDate,
      time: jobRequest.workTime,
    });

    return `${baseUrl}?${query.toString()}`;
  }

  async acceptOffer(jobRequestId: number, ip: string): Promise<JobRequest> {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id: jobRequestId },
    });

    if (!jobRequest) {
      throw new NotFoundException(`Заявка с ID ${jobRequestId} не найдена`);
    }

    const activeOffer = await this.publicOffersService.getActive();
    const offerContent = activeOffer.content;
    const offerVersion = activeOffer.version;
    const offerHash = generateOfferHash(offerContent);

    jobRequest.offerAccepted = true;
    jobRequest.offerAcceptedAt = new Date();
    jobRequest.acceptedOfferVersion = offerVersion;
    jobRequest.acceptedOfferContent = offerContent;
    jobRequest.acceptedOfferHash = offerHash;
    jobRequest.clientIp = ip;

    await this.offerAcceptanceLogRepository.save({
      jobRequestId: jobRequest.id,
      offerVersion,
      offerContent,
      offerHash,
      clientIp: ip,
      clientPhone: jobRequest.phoneNumber,
      clientAddress: jobRequest.address,
      clientHouse: jobRequest.house,
      clientApartment: jobRequest.apartment,
    });

    await this.logUploaderService.uploadOfferAcceptanceLog({
      jobRequestId: jobRequest.id,
      phoneNumber: jobRequest.phoneNumber,
      offerVersion,
      offerContent,
      offerHash,
      clientIp: ip,
      address: jobRequest.address,
      house: jobRequest.house,
      apartment: jobRequest.apartment,
    });

    return this.jobRequestRepository.save(jobRequest);
  }

  async sendRequestToWorkers(jobRequestId: number): Promise<void> {
    const fullJobRequest = await this.jobRequestRepository.findOne({
      where: { id: jobRequestId },
      relations: ['occupation', 'city'],
    });

    if (!fullJobRequest) {
      throw new NotFoundException('JobRequest не найден после сохранения');
    }

    const matchedWorkers = await this.workerRepository.find({
      where: {
        occupation_id: fullJobRequest.occupation_id,
        cityId: fullJobRequest.city_id,
        isActive: true,
      } as FindOptionsWhere<Worker>,
    });

    for (const worker of matchedWorkers) {
      if (!worker.email) continue;

      await this.mailService.sendJobRequestToWorker({
        email: worker.email,
        fullName: worker.fullName,
        workerId: worker.id,
        jobRequestId: fullJobRequest.id,
        workDate: fullJobRequest.workDate,
        workTime: fullJobRequest.workTime,
        address: fullJobRequest.address,
        house: fullJobRequest.house,
        occupationTitle: fullJobRequest.occupation.title,
        cityName: fullJobRequest.city.name,
        comments: fullJobRequest.comments,
      });
    }

    fullJobRequest.wasSentToMasters = true;
    await this.jobRequestRepository.save(fullJobRequest);
  }

  async book(jobRequestId: number, workerId: number): Promise<JobRequest> {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id: jobRequestId },
      relations: ['occupation'],
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
        address: updatedRequest.address,
        house: updatedRequest.house,
        workDate: updatedRequest.workDate,
        workTime: updatedRequest.workTime,
        clientPhone: updatedRequest.phoneNumber,
        requestId: updatedRequest.id,
        apartment: updatedRequest.apartment,
        comments: updatedRequest.comments,
      });
    }

    if (worker && jobRequest.email) {
      await this.mailService.sendBookingInfoToClient({
        email: jobRequest.email,
        fullName: jobRequest.name,
        workerName: worker.fullName,
        workerPhone: worker.phoneNumber,
        workDate: updatedRequest.workDate,
        workTime: updatedRequest.workTime,
        occupationTitle: updatedRequest.occupation.title,
        address: updatedRequest.address,
        house: updatedRequest.house,
        apartment: updatedRequest.apartment,
        requestId: updatedRequest.id,
        comments: updatedRequest.comments,
      });
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
      relations: ['occupation', 'city'],
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
        workDate: jobRequest.workDate,
        workTime: jobRequest.workTime,
        address: jobRequest.address,
      });
    }

    return updatedRequest;
  }
}
