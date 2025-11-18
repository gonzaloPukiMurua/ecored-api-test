/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { EcopointActionRepository } from '../repositories/ecopoint-action.repository';
import { CategoryFactorRepository } from '../repositories/category-factor.repository';
import { UserHistoryRepository } from '../repositories/user-history.repository';
import { RegisterEcopointDto } from '../DTOs/register-ecopoint.dto';
import { User } from 'src/user/entities/user.entity';
import { EcopointActionService } from './action.service';
import { CategoryFactorService } from './category-factor.service';

@Injectable()
export class EcoPointsService {
  constructor(
    private actionRepository: EcopointActionRepository,
    private actionService: EcopointActionService,
    private factorRepository: CategoryFactorRepository,
    private factorService: CategoryFactorService,
    private historyRepository: UserHistoryRepository,
  ) {}

  async registerAction(dto: RegisterEcopointDto) {
    const action = await this.actionService.findOneByName(dto.action_name);
    if (!action) throw new NotFoundException('Action not found');
    console.log("Accion: ", action);
    console.log("Categoria id: ", dto.category_id);

    const factor = await this.factorService.findOneByCategoryId(dto.category_id);
    if (!factor) throw new NotFoundException('Category factor not found');

    const pointsTotal = action.points_base * factor.factor_circular;

    const history = this.historyRepository.create({
      user: { user_id: dto.user_id } as Partial<User>,
      action,
      category: factor.category,
      points_action: action.points_base,
      factor_category: factor.factor_circular,
      points_total: pointsTotal,
      extra_data: dto.extra_data ?? null,
    });

    await this.historyRepository.save(history);

    return {
      message: 'EcoPoints registrados',
      points: pointsTotal,
      details: history,
    };
  }

  getUserHistory(user_id: string) {
    return this.historyRepository.findByUser(user_id);
  }

  getUserTotal(user_id: string) {
    return this.historyRepository.getUserTotalPoints(user_id);
  }
}
