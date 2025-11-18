/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { CategoryFactorController } from './controllers/category-factor.controller';
import { EcopointActionController } from './controllers/ecopoints-actions.controller';
import { EcopointsController } from './controllers/ecopoints.controller';
import { EcoPointsService } from './services/ecopoints.service';
import { EcopointActionService } from './services/action.service';
import { CategoryFactorService } from './services/category-factor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcopointUserHistory } from './entities/ecopoint-user-history.entity';
import { EcopointAction } from './entities/ecopoint-action.entity';
import { EcopointCategoryFactor } from './entities/ecopoint-category-factor.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { UserHistoryRepository } from './repositories/user-history.repository';
import { EcopointActionRepository } from './repositories/ecopoint-action.repository';
import { CategoryFactorRepository } from './repositories/category-factor.repository';
import { EcopointSeedService } from './services/ecopoint-seed.service';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EcopointUserHistory,
      EcopointAction,
      EcopointCategoryFactor,
      User,
      Category
    ]),
    CategoryModule,
    UserModule
  ],
  providers: [
    EcoPointsService,
    EcopointActionService,
    CategoryFactorService,
    UserHistoryRepository,
    EcopointSeedService,
    EcopointActionRepository,
    CategoryFactorRepository
  ],
  controllers: [
    CategoryFactorController,
    EcopointActionController,
    EcopointsController
    
  ],
  exports: [
    EcoPointsService,
    EcopointActionService,
    CategoryFactorService
  ]
})
export class EcoPointsModule {}
