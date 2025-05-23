import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupation } from './entities/occupation.entity';
import { CreateOccupationDto } from './dto/create-occupation.dto';

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

  findOne(id: number) {
    return `This action returns a #${id} occupation`;
  }

  // update(id: number, updateOccupationDto: UpdateOccupationDto) {
  //   return `This action updates a #${id} occupation`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} occupation`;
  // }
}
