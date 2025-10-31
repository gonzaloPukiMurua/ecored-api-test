/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Request } from 'express';
import {
  CallHandler,
  ExecutionContext,
 } from '@nestjs/common';
async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('EcoRed')
    .setDescription('API para EcoRed')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.setGlobalPrefix('ecored-api');
  app.useGlobalInterceptors({
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest<Request>();
      console.log(`📡 ${req.method} ${req.url}`);
      return next.handle();
    },
  });
  await app.listen(port, () => console.log("Puerto: ", port));
}
bootstrap();
