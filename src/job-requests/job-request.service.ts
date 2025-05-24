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

@Injectable()
export class JobRequestService {
  constructor(
    @InjectRepository(JobRequest)
    private readonly jobRequestRepository: Repository<JobRequest>,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,

    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}

  async create(data: CreateJobRequestDto): Promise<JobRequest> {
    const jobRequest = this.jobRequestRepository.create({
      name: data.name,
      phoneNumber: data.phoneNumber,
      workDate: data.workDate,
      workTime: data.workTime,
      address: data.address,
      comments: data.comments,
      occupation: { id: data.occupationId },
      category: { id: data.categoryId },
      city: { id: data.cityId },
    });

    const savedJobRequest = await this.jobRequestRepository.save(jobRequest);

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
      });
    }

    if (worker && jobRequest.phoneNumber) {
      const smsText =
        `✅ Ваша заявка №${updatedRequest.id} принята.\n` +
        `Исполнитель: ${worker.fullName}, ${worker.phoneNumber}\n` +
        `${updatedRequest.workDate} в ${updatedRequest.workTime}\n` +
        `Адрес: ${updatedRequest.address}`;

      await this.smsService.sendSms(jobRequest.phoneNumber, smsText);
    }

    return updatedRequest;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: JobRequest[]; total: number }> {
    const [data, total] = await this.jobRequestRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

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
}
