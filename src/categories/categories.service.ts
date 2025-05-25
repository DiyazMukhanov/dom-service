import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      title: dto.title,
      price: dto.price,
      occupation: { id: dto.occupationId },
    });

    return await this.categoryRepository.save(category);
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new Error(`Категория с ID ${id} не найдена`);
    }

    if (dto.title !== undefined) {
      category.title = dto.title;
    }

    if (dto.price !== undefined) {
      category.price = dto.price;
    }

    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
