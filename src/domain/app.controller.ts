import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '../util/jwt/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 로드밸런서
  @Get('/')
  async elb() {
    return 'hello world!!!';
  }

  // 메일로 에러 로그 보내기
  @Get('/error')
  @UseGuards(JwtAuthGuard)
  async errorSend() {
    return this.appService.errorSend();
  }

  // 에러 메모장에 적기
  @Post('/error')
  async errorLog(
    @Body('errorMessage') errorMessage,
    @Body('metaData') metaData,
  ) {
    return this.appService.errorLog(errorMessage, metaData);
  }

  @Post('/update')
  managerUpdate() {
    return this.appService.managerUpdate();
  }

  @Post('/query')
  managerQuery() {
    return this.appService.managerQuery();
  }
}
