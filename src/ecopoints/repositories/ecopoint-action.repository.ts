/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EcopointAction } from '../entities/ecopoint-action.entity';

@Injectable()
export class EcopointActionRepository extends Repository<EcopointAction> {
  constructor(private dataSource: DataSource) {
    super(EcopointAction, dataSource.createEntityManager());
  }

  async findActive() {
    return this.find({ where: { active: true } });
  }

  async findByName(name: string) {
    return await this.findOne({ where: { name } });
  }
}
