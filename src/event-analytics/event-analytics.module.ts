/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { EventAnalyticsController } from './event-analytics.controller';
import { EventAnalyticsService } from './event-analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAnalytics } from './entities/event-analytics.entity';
import { UserModule } from 'src/user/user.module';
import { ListingModule } from 'src/listing/listing.module';
import { RequestModule } from 'src/request/request.module';
import { EventAnalyticsRepository } from './event-analytics.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventAnalytics]),
    UserModule,
    forwardRef(() => ListingModule),
    forwardRef(() => RequestModule),
    JwtModule,
    ConfigModule.forFeature(jwtConfig)
  ],
  controllers: [EventAnalyticsController],
  providers: [EventAnalyticsService, EventAnalyticsRepository],
  exports: [EventAnalyticsService, TypeOrmModule],
})
export class EventAnalyticsModule {}
