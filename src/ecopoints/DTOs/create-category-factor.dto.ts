/* eslint-disable prettier/prettier */
import { IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryFactorDto {
  @ApiProperty()
  @IsUUID()
  category_id!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  factor_circular!: number;
}
