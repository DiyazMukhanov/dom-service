// src/public-offers/public-offers.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicOffer } from './entities/public-offer.entity';
import { CreatePublicOfferDto } from './dto/create-public-offer.dto';
import { UpdatePublicOfferDto } from './dto/update-public-offer.dto';

@Injectable()
export class PublicOffersService {
  constructor(
    @InjectRepository(PublicOffer)
    private repo: Repository<PublicOffer>,
  ) {}

  async create(dto: CreatePublicOfferDto): Promise<PublicOffer> {
    const offer = this.repo.create({ ...dto, isActive: false });
    return this.repo.save(offer);
  }

  async update(id: number, dto: UpdatePublicOfferDto): Promise<PublicOffer> {
    const offer = await this.repo.findOneBy({ id });
    if (!offer) throw new NotFoundException('Оферта не найдена');

    const updated = Object.assign(offer, dto);
    return this.repo.save(updated);
  }

  async findAll(): Promise<PublicOffer[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<PublicOffer> {
    const offer = await this.repo.findOneBy({ id });
    if (!offer) throw new NotFoundException('Оферта не найдена');
    return offer;
  }

  async getActive(): Promise<PublicOffer> {
    const offer = await this.repo.findOneBy({ isActive: true });
    if (!offer) throw new NotFoundException('Активная оферта не найдена');
    return offer;
  }

  async setActive(id: number): Promise<void> {
    const offer = await this.repo.findOneBy({ id });
    if (!offer) throw new NotFoundException('Оферта не найдена');

    await this.repo.update({ isActive: true }, { isActive: false }); // сброс всех
    await this.repo.update(id, { isActive: true });
  }
}
