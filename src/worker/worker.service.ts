import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Repository } from 'typeorm';
import { Worker as WorkerEntity } from './entities/worker.entity';
import { Occupation } from '../occupations/entities/occupation.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(WorkerEntity)
    private readonly workerRepository: Repository<WorkerEntity>,
    private readonly mailService: MailService,
  ) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<WorkerEntity> {
    const worker: WorkerEntity = this.workerRepository.create({
      phoneNumber: createWorkerDto.phoneNumber,
      fullName: createWorkerDto.fullName,
      email: createWorkerDto.email,
      occupation: createWorkerDto.occupationId
        ? ({ id: createWorkerDto.occupationId } as Occupation)
        : undefined,
    });

    return await this.workerRepository.save(worker);
  }

  async sendEmailConfirmation(workerId: number): Promise<{ code: string }> {
    const worker = await this.workerRepository.findOne({
      where: { id: workerId },
    });

    if (!worker || !worker.email) {
      throw new NotFoundException('Работник не найден или email отсутствует');
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4-значный код

    await this.mailService.sendEmailCode(worker.email, worker.fullName, code);

    return { code }; // 👈 вернём в ответе
  }

  async confirmEmail(workerId: number): Promise<{ success: boolean }> {
    const worker = await this.workerRepository.findOne({
      where: { id: workerId },
    });

    if (!worker) {
      throw new NotFoundException('Работник не найден');
    }

    if (worker.isEmailConfirmed) {
      return { success: true }; // Уже подтверждён
    }

    worker.isEmailConfirmed = true;
    await this.workerRepository.save(worker);

    return { success: true };
  }

  async findAll(
    occupationId?: number,
    isActive?: boolean,
    isEmailConfirmed?: boolean,
    page = 1,
    limit = 10,
  ): Promise<{ data: WorkerEntity[]; total: number }> {
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

    if (isEmailConfirmed !== undefined) {
      query.andWhere('worker.isEmailConfirmed = :isEmailConfirmed', {
        isEmailConfirmed,
      });
    }

    query.orderBy('worker.id', 'DESC');

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<WorkerEntity> {
    const worker = await this.workerRepository.findOne({
      where: { id },
      relations: ['occupation', 'ratings'],
    });

    if (!worker) {
      throw new NotFoundException(`Работник с ID ${id} не найден`);
    }

    return worker;
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

    if (updateWorkerDto.isEmailConfirmed !== undefined) {
      existing.isEmailConfirmed = updateWorkerDto.isEmailConfirmed;
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
