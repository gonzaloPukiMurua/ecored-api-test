/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryFactorRepository } from '../repositories/category-factor.repository';
import { CreateCategoryFactorDto } from '../DTOs/create-category-factor.dto';
import { UpdateCategoryFactorDto } from '../DTOs/update-category-factor.dto';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryFactorService {
  constructor(
    private factorRepository: CategoryFactorRepository,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

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

  /**
   * 🔥 Obtiene factor de categoría aplicando las reglas:
   * 1. Si la categoría es subcategoría → usar parent_id
   * 2. Si no existe factor → crear uno con factor_circular=1
   */
  async findOneByCategoryId(category_id: string) {
    // 1️⃣ Obtener categoría real (incluyendo parent)
    const category = await this.categoryRepository.findOne({
      where: { category_id },
      relations: ['parent'],
    });

    if (!category) throw new NotFoundException('Category not found');

    let targetCategoryId = category.category_id;

    // 2️⃣ Si es subcategoría → usar el parent_id
    if (category.parent) {
      targetCategoryId = category.parent.category_id;
    }

    // 3️⃣ Buscar factor de la categoría efectiva
    let factor = await this.factorRepository.getFactorByCategory(targetCategoryId);

    // 4️⃣ Si no existe → crear factor = 1
    if (!factor) {
      factor = this.factorRepository.create({
        category: { category_id: targetCategoryId } as Partial<Category>,
        factor_circular: 1,
      });

      factor = await this.factorRepository.save(factor);
    }

    return factor;
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
