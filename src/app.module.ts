/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { ProductPhotosModule } from './product-photo/product-photo.module';
import { CategoryModule } from './category/category.module';
import { RequestModule } from './request/request.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ReportModule } from './report/report.module';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { EventAnalyticsModule } from './event-analytics/event-analytics.module';
import * as fs from 'fs';
import * as path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AddressModule } from './address/address.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example', '.env.development'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
          const caPath = configService.get<string>('SSL_CA_CERT');
          console.log("ca.pem path: ", caPath);
          const sslEnabled = configService.get<string>('DB_SSL') === 'true';
          const sslCa = 
            caPath && fs.existsSync(path.resolve(caPath))
            ? fs.readFileSync(path.resolve(caPath)).toString()
            : undefined;
          console.log(sslCa);
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            ssl: sslCa
              ? { rejectUnauthorized: true, ca: sslCa}
              : sslEnabled
              ? { rejectUnauthorized: false}
              : false,
            autoLoadEntities: true,
            synchronize: false
          }
        },
      }),
    AuthModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()), 
    UserModule, 
    ProductModule, 
    ProductPhotosModule, 
    CategoryModule, 
    RequestModule, 
    DeliveryModule, 
    ReportModule, 
    EventAnalyticsModule, AddressModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
  ],
})
export class AppModule {}
