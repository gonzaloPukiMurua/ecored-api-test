/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { ListingModule } from 'src/listing/listing.module';
import { UserModule } from 'src/user/user.module';
import { RequestRepository } from './request.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { EventAnalyticsModule } from 'src/event-analytics/event-analytics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    forwardRef(() => ListingModule),
    UserModule,
    forwardRef(() => EventAnalyticsModule),
    JwtModule,
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
  exports: [RequestService, RequestRepository]
})
export class RequestModule {}
