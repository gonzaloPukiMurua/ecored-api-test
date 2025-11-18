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
import { EcopointActionService } from '../services/action.service';
import { CreateEcopointActionDto } from '../DTOs/create-ecopoint-action.dto';
import { UpdateEcopointActionDto } from '../DTOs/update-ecopoint-action.dto';

@Controller('actions')
export class EcopointActionController {
  constructor(private readonly actionService: EcopointActionService) {}

  @Post()
  create(@Body() dto: CreateEcopointActionDto) {
    return this.actionService.create(dto);
  }

  @Get()
  findAll() {
    return this.actionService.findAll();
  }

  @Get(':action_id')
  findOne(@Param('action_id') id: string) {
    return this.actionService.findOne(id);
  }

  @Patch(':action_id')
  update(@Param('action_id') id: string, @Body() dto: UpdateEcopointActionDto) {
    return this.actionService.update(id, dto);
  }

  @Delete(':action_id')
  remove(@Param('action_id') id: string) {
    return this.actionService.remove(id);
  }
}
