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
      occupation: createWorkerDto.occupationId
        ? ({ id: createWorkerDto.occupationId } as Occupation)
        : undefined,
    });

    return await this.workerRepository.save(worker);
  }

  async findAll(
    occupationId?: number,
    isActive?: boolean,
  ): Promise<WorkerEntity[]> {
    const query = this.workerRepository
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.occupation', 'occupation')
      .leftJoinAndSelect('worker.ratings', 'ratings');

    if (occupationId !== undefined) {
      query.where('occupation.id = :occupationId', { occupationId });
    }

    if (isActive !== undefined) {
      query.andWhere('worker.isActive = :isActive', { isActive });
    }

    return await query.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} worker`;
  }

  async update(
    id: number,
    updateWorkerDto: UpdateWorkerDto,
  ): Promise<WorkerEntity> {
    const existing = await this.workerRepository.findOneBy({ id });
    if (!existing) {
      throw new Error(`Worker with ID ${id} not found`);
    }

    if (updateWorkerDto.fullName !== undefined) {
      existing.fullName = updateWorkerDto.fullName;
    }

    if (updateWorkerDto.phoneNumber !== undefined) {
      existing.phoneNumber = updateWorkerDto.phoneNumber;
    }

    if (updateWorkerDto.isActive !== undefined) {
      existing.isActive = updateWorkerDto.isActive;
    }

    if (updateWorkerDto.occupationId !== undefined) {
      existing.occupation = { id: updateWorkerDto.occupationId } as Occupation;
    }

    return await this.workerRepository.save(existing);
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
