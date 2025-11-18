/* eslint-disable prettier/prettier */
import { IsInt, IsString, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEcopointActionDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  name!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  points_base!: number;
}