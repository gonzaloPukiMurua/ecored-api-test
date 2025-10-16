/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;
}