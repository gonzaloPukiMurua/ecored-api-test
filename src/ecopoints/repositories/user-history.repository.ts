/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EcopointUserHistory } from '../entities/ecopoint-user-history.entity';

@Injectable()
export class UserHistoryRepository extends Repository<EcopointUserHistory> {
  constructor(dataSource: DataSource) {
    super(EcopointUserHistory, dataSource.createEntityManager());
  }

  async findByUser(user_id: string) {
    return this.find({
      where: { user: { user_id: user_id } },
      relations: ['user', 'action', 'category'],
      order: { created_at: 'DESC' },
    });
  }

  async getUserTotalPoints(user_id: string): Promise<number> {
    const result = await this.createQueryBuilder('h')
      .select('SUM(h.points_total)', 'sum')
      .where('h.user_id = :user_id', { user_id })
      .getRawOne<{ sum: string | number | null }>();

    const sumValue = result?.sum ?? 0;

    const numeric = Number(sumValue);

    return isNaN(numeric) ? 0 : numeric;
  }
}
