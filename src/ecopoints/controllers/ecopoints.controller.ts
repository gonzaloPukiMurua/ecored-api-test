/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { EcoPointsService } from '../services/ecopoints.service';
import { RegisterEcopointDto } from '../DTOs/register-ecopoint.dto';
import { EcopointSeedService } from '../services/ecopoint-seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('ecopoints')
export class EcopointsController {
  constructor(
    private readonly ecopointsService: EcoPointsService,
    private readonly ecopointSeedService: EcopointSeedService
  ) {}

  @Post('register')
  register(@Body() dto: RegisterEcopointDto) {
    return this.ecopointsService.registerAction(dto);
  }

  @Get('history/:user_id')
  getHistory(@Param('user_id') user_id: string) {
    return this.ecopointsService.getUserHistory(user_id);
  }

  @Get('total/:user_id')
  getTotal(@Param('user_id') user_id: string) {
    return this.ecopointsService.getUserTotal(user_id);
  }

  @Post('seed/ecopoints')
  @Auth(AuthType.None)
  runEcoPointSeed() {
    return this.ecopointSeedService.runAll();
  }
}
