/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventAnalyticsController } from './event-analytics.controller';
import { EventAnalyticsService } from './event-analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAnalytics } from './entities/event-analytics.entity';
import { UserModule } from 'src/user/user.module';
import { ListingModule } from 'src/listing/listing.module';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventAnalytics]),
    UserModule,
    ListingModule,
    RequestModule
  ],
  controllers: [EventAnalyticsController],
  providers: [EventAnalyticsService],
  exports: [EventAnalyticsService, TypeOrmModule],
})
export class EventAnalyticsModule {}
