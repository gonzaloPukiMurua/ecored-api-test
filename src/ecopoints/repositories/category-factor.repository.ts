/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EcopointCategoryFactor } from '../entities/ecopoint-category-factor.entity';

@Injectable()
export class CategoryFactorRepository extends Repository<EcopointCategoryFactor> {
  constructor(dataSource: DataSource) {
    super(EcopointCategoryFactor, dataSource.createEntityManager());
  }

  async getFactorByCategory(category_id: string) {
    return await this.createQueryBuilder('f')
      .leftJoinAndSelect('f.category', 'c')
      .where('c.category_id = :category_id', { category_id })
      .andWhere('f.active = :active', { active: true })
      .getOne();
  }
}
