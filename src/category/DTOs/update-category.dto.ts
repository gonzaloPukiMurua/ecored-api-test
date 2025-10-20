/* eslint-disable prettier/prettier */
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsUUID } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'ID de la categoría a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  category_id!: string;
}