/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { EcopointActionRepository } from '../repositories/ecopoint-action.repository';
import { CreateEcopointActionDto } from '../DTOs/create-ecopoint-action.dto';
import { UpdateEcopointActionDto } from '../DTOs/update-ecopoint-action.dto';

@Injectable()
export class EcopointActionService {
  constructor(private actionRepository: EcopointActionRepository) {}

  async create(dto: CreateEcopointActionDto) {
    const existing = await this.actionRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      Object.assign(existing, dto);
      return this.actionRepository.save(existing);
    }
    
    const action = this.actionRepository.create(dto);
    return this.actionRepository.save(action);
  }

  findAll() {
    return this.actionRepository.find();
  }

  findOne(id: string) {
    return this.actionRepository.findOne({ where: { action_id: id } });
  }

  findOneByName(action_name: string){
    return this.actionRepository.findByName(action_name)
  }

  async update(id: string, dto: UpdateEcopointActionDto) {
    const action = await this.findOne(id);
    if (!action) throw new NotFoundException('Action not found');

    Object.assign(action, dto);
    return this.actionRepository.save(action);
  }

  async remove(id: string) {
    return this.actionRepository.delete({ action_id: id });
  }
}
