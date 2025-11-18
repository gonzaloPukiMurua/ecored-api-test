/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './services/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './category.repository';
import { CategorySeedService } from './services/category-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategorySeedService, CategoryRepository],
  exports: [CategoryService]
})
export class CategoryModule {}
