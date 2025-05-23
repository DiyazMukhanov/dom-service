import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { JobRequest } from './entities/job-request.entity';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { MailService } from '../mail/mail.service';
import { Worker } from '../worker/entities/worker.entity';

@Injectable()
export class JobRequestService {
  constructor(
    @InjectRepository(JobRequest)
    private readonly jobRequestRepository: Repository<JobRequest>,
    private readonly mailService: MailService,

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

    const matchedWorkers = await this.workerRepository.find({
      where: {
        occupation_id: data.occupationId,
        isActive: true,
      } as FindOptionsWhere<Worker>,
    });

    return savedJobRequest;
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
