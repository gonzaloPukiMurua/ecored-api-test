/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateEcopointActionDto } from './create-ecopoint-action.dto';

export class UpdateEcopointActionDto extends PartialType(CreateEcopointActionDto) {}
