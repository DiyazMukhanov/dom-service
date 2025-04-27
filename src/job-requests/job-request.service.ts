import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobRequest } from './job-request.entity';
import { CreateJobRequestDto } from './dto/create-job-request.dto';

@Injectable()
export class JobRequestService {
  constructor(
    @InjectRepository(JobRequest)
    private readonly jobRequestRepository: Repository<JobRequest>,
  ) {}

  async create(data: CreateJobRequestDto): Promise<JobRequest> {
    const jobRequest = this.jobRequestRepository.create(data);
    return this.jobRequestRepository.save(jobRequest);
  }

  async findAll(page = 1, limit = 10): Promise<JobRequest[]> {
    const [requests] = await this.jobRequestRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return requests;
  }
}
