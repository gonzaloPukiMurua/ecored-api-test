/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryFactorRepository } from '../repositories/category-factor.repository';
import { CreateCategoryFactorDto } from '../DTOs/create-category-factor.dto';
import { UpdateCategoryFactorDto } from '../DTOs/update-category-factor.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class CategoryFactorService {
  constructor(private factorRepository: CategoryFactorRepository) {}

  create(dto: CreateCategoryFactorDto) {
    const factor = this.factorRepository.create({
      factor_circular: dto.factor_circular,
      category: { category_id: dto.category_id } as Partial<Category>,
    });

    return this.factorRepository.save(factor);
  }

  findAll() {
    return this.factorRepository.find({ relations: ['category'] });
  }

  async findOne(id: string) {
    const factor = await this.factorRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!factor) throw new NotFoundException('Category factor not found');

    return factor;
  }

  async findOneByCategoryId(category_id: string){
    return await this.factorRepository.getFactorByCategory(category_id);
  }

  async update(id: string, dto: UpdateCategoryFactorDto) {
    const factor = await this.findOne(id);
    Object.assign(factor, {
      factor_circular: dto.factor_circular ?? factor.factor_circular,
      category: dto.category_id
        ? ({ category_id: dto.category_id } as Partial<Category>)
        : factor.category,
    });

    return this.factorRepository.save(factor);
  }

  remove(id: string) {
    return this.factorRepository.delete(id);
  }
}
