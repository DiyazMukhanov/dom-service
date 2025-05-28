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
      cityId: createWorkerDto.cityId,
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
    cityId?: number,
    minAverageRating?: number, // новое условие
    page = 1,
    limit = 10,
  ): Promise<{ data: any[]; total: number }> {
    const query = this.workerRepository
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.occupation', 'occupation')
      .leftJoin('worker.ratings', 'ratings')
      .leftJoinAndSelect('worker.city', 'city')
      .addSelect('AVG(ratings.value)', 'averageRating')
      .groupBy('worker.id')
      .addGroupBy('occupation.id')
      .addGroupBy('city.id');

    if (occupationId !== undefined) {
      query.andWhere('occupation.id = :occupationId', { occupationId });
    }

    if (isActive !== undefined) {
      query.andWhere('worker.isActive = :isActive', { isActive });
    }

    if (isEmailConfirmed !== undefined) {
      query.andWhere('worker.isEmailConfirmed = :isEmailConfirmed', {
        isEmailConfirmed,
      });
    }

    if (cityId !== undefined) {
      query.andWhere('worker.cityId = :cityId', { cityId });
    }

    if (minAverageRating !== undefined) {
      query.having('AVG(ratings.value) <= :minRating', {
        minRating: minAverageRating,
      });
    }

    query.orderBy('worker.id', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [workers, total] = await query.getManyAndCount();

    // Для каждого worker в entities — вычисли средний рейтинг
    const rawResults = await query.getRawMany();

    const data = workers.map((worker, index) => {
      const avg = parseFloat(rawResults[index]?.averageRating) || null;
      return {
        ...worker,
        averageRating: avg,
      };
    });

    return { data, total };
  }

  async findOne(id: number): Promise<any> {
    const worker = await this.workerRepository
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.occupation', 'occupation')
      .leftJoinAndSelect('worker.city', 'city')
      .leftJoin('worker.ratings', 'ratings')
      .where('worker.id = :id', { id })
      .addSelect('AVG(ratings.value)', 'averageRating')
      .groupBy('worker.id')
      .addGroupBy('occupation.id')
      .addGroupBy('city.id')
      .getRawAndEntities();

    const entity = worker.entities[0];
    const raw = worker.raw[0];

    if (!entity) {
      throw new NotFoundException(`Работник с ID ${id} не найден`);
    }

    return {
      ...entity,
      averageRating: raw?.averageRating
        ? parseFloat(raw.averageRating).toFixed(2)
        : null,
    };
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

    if (updateWorkerDto.cityId !== undefined) {
      existing.cityId = updateWorkerDto.cityId;
    }

    return await this.workerRepository.save(existing);
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
