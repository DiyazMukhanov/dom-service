import { Injectable } from '@nestjs/common';
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
}
