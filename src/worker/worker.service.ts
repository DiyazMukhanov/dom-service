import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Repository } from 'typeorm';
import { Worker as WorkerEntity } from './entities/worker.entity';
import { Occupation } from '../occupations/entities/occupation.entity';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(WorkerEntity)
    private readonly workerRepository: Repository<WorkerEntity>,
  ) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<WorkerEntity> {
    const worker: WorkerEntity = this.workerRepository.create({
      phoneNumber: createWorkerDto.phoneNumber,
      fullName: createWorkerDto.fullName,
      rating: createWorkerDto.rating ?? 0,
      occupation: createWorkerDto.occupationId
        ? ({ id: createWorkerDto.occupationId } as Occupation)
        : undefined,
    });

    return await this.workerRepository.save(worker);
  }

  findAll() {
    return `This action returns all worker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} worker`;
  }

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
    return `This action updates a #${id} worker`;
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
