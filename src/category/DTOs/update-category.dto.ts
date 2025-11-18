/* eslint-disable prettier/prettier */
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { CategoryBlock } from '../enums/category-block.enum';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'ID de la categoría a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  category_id!: string;

  @ApiProperty({
    description: 'Bloque al que pertenece la categoría',
    enum: CategoryBlock,
    example: CategoryBlock.PRODUCTOS_FUNCIONALES,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(CategoryBlock)
  block?: CategoryBlock | null;

  @ApiProperty({
    description: 'ID de la categoría padre (si aplica)',
    example: null,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parent_id?: string | null;
}
