/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateCategoryFactorDto } from './create-category-factor.dto';

export class UpdateCategoryFactorDto extends PartialType(CreateCategoryFactorDto) {}