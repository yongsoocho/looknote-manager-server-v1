import {
  Body,
  Controller, Delete,
  Get,
  ParseIntPipe,
  Post,
  Query, Req,
  UseGuards,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { JwtAuthGuard } from '../../util/jwt/jwt.guard';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getManagerList(@Query('page', ParseIntPipe) page) {
    return this.managerService.getManagerList(page);
  }

  @Get('relogin')
  @UseGuards(JwtAuthGuard)
  tokenReLogin(@Req() req) {
    return req.user;
  }

  @Post('login')
  managerLogin(@Body() mangerLoginBody) {
    return this.managerService.managerLogin(mangerLoginBody);
  }

  @Post('join')
  @UseGuards(JwtAuthGuard)
  createManager(@Body() managerCreateBody, @Req() req) {
    return this.managerService.createManager(managerCreateBody, req.user);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteManager(@Body('manager_id', ParseIntPipe) manager_id) {
    return this.managerService.deleteManager(manager_id);
  }
}
