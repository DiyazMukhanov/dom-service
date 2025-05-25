import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async createCity(name: string): Promise<City> {
    const city = this.cityRepository.create({ name });
    return this.cityRepository.save(city);
  }

  async findAllCities(): Promise<City[]> {
    return this.cityRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateCity(id: number, name: string): Promise<City> {
    const city = await this.cityRepository.findOne({ where: { id } });

    if (!city) {
      throw new NotFoundException(`Город с ID ${id} не найден`);
    }

    city.name = name;

    return this.cityRepository.save(city);
  }

  async deleteCity(id: number): Promise<void> {
    const result = await this.cityRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Город с ID ${id} не найден`);
    }
  }
}
