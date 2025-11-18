/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  IsEnum,
} from 'class-validator';
import { CategoryBlock } from '../enums/category-block.enum';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónica',
  })
  @IsString()
  @Length(2, 50)
  name!: string;

  @ApiProperty({
    description: 'ID de la categoría padre (opcional)',
    example: null,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parent_id?: string | null;

  @ApiProperty({
    description: 'Bloque al que pertenece la categoría',
    enum: CategoryBlock,
    required: false,
    nullable: true,
    example: CategoryBlock.PRODUCTOS_FUNCIONALES,
  })
  @IsOptional()
  @IsEnum(CategoryBlock)
  block?: CategoryBlock | null;
}
