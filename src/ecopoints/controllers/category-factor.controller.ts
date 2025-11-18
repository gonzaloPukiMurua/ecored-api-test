/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoryFactorService } from '../services/category-factor.service';
import { CreateCategoryFactorDto } from '../DTOs/create-category-factor.dto';
import { UpdateCategoryFactorDto } from '../DTOs/update-category-factor.dto';

@Controller('category-factors')
export class CategoryFactorController {
  constructor(private readonly factorService: CategoryFactorService) {}

  @Post()
  create(@Body() dto: CreateCategoryFactorDto) {
    return this.factorService.create(dto);
  }

  @Get()
  findAll() {
    return this.factorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryFactorDto) {
    return this.factorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factorService.remove(id);
  }
}
