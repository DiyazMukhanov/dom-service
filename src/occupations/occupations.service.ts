import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupation } from './entities/occupation.entity';
import { CreateOccupationDto } from './dto/create-occupation.dto';
import { UpdateOccupationDto } from './dto/update-occupation.dto';

@Injectable()
export class OccupationsService {
  constructor(
    @InjectRepository(Occupation)
    private readonly occupationRepository: Repository<Occupation>,
  ) {}

  async create(createOccupationDto: CreateOccupationDto): Promise<Occupation> {
    const occupation = this.occupationRepository.create(createOccupationDto);
    return await this.occupationRepository.save(occupation);
  }

  async findAll(): Promise<Occupation[]> {
    return this.occupationRepository.find({
      relations: ['categories'],
    });
  }

  async findOne(id: number): Promise<Occupation> {
    const occupation = await this.occupationRepository.findOne({
      where: { id },
    });
    if (!occupation) {
      throw new NotFoundException(`Occupation with ID ${id} not found`);
    }
    return occupation;
  }

  async update(
    id: number,
    updateOccupationDto: UpdateOccupationDto,
  ): Promise<Occupation> {
    const occupation = await this.findOne(id);

    if (updateOccupationDto.title !== undefined) {
      occupation.title = updateOccupationDto.title;
    }

    return await this.occupationRepository.save(occupation);
  }

  async remove(id: number): Promise<void> {
    const occupation = await this.findOne(id);
    await this.occupationRepository.remove(occupation);
  }
}
