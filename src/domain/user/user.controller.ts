import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../util/jwt/jwt.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserListWithPagenation(@Query('page', ParseIntPipe) page: number) {
    return this.userService.getUserListWithPagenation(page);
  }

  @Delete()
  deleteUser(@Body('user_id', ParseIntPipe) user_id: number) {
    return this.userService.deleteUser(user_id);
  }

  @Get('quit')
  getQuitUserList(@Query('page', ParseIntPipe) page: number) {
    return this.userService.getQuitUserList(page);
  }

  @Post('quit')
  searchQuitWithEmail(@Query('email') email: string) {
    return this.userService.searchQuitWithEmail(email);
  }

  @Delete('quit')
  undoWithdraw(@Body('user_id', ParseIntPipe) user_id: number) {
    return this.userService.undoWithdraw(user_id);
  }

  @Get('/coin')
  getCoinList(@Query('page', ParseIntPipe) page) {
    return this.userService.getCoinList(page);
  }

  @Get('/reward')
  getPostRewardList(@Query('page', ParseIntPipe) page) {
    return this.userService.getPostRewardList(page);
  }

  @Post('/coin')
  giveCoinToUser(
    @Body('user_id', ParseIntPipe) user_id: number,
    @Body('coin', ParseIntPipe) coin: number,
  ) {
    return this.userService.givePointToUser(user_id, coin);
  }

  @Delete('/coin')
  minusUserCoin(
    @Body('user_id', ParseIntPipe) user_id: number,
    @Body('coin', ParseIntPipe) coin: number,
  ) {
    return this.userService.minusUserCoin(user_id, coin);
  }

  @Patch('/coin')
  setUserPoint(
    @Body('user_id', ParseIntPipe) user_id: number,
    @Body('coin', ParseIntPipe) coin: number,
    @Body('coin_sum', ParseIntPipe) coin_sum: number,
  ) {
    return this.userService.setUserPoint(user_id, coin, coin_sum);
  }

  @Patch('/password')
  userPasswordReset(
    @Body('email') email: string,
    @Body('provider') provider: string,
  ) {
    return this.userService.userPasswordReset(email, provider);
  }

  @Get('search')
  userSearchByUserId(@Query('user_id', ParseIntPipe) user_id: number) {
    return this.userService.userSearchByUserId(user_id);
  }

  @Post('search/email')
  userSearchByEmail(@Body('email') email: string) {
    return this.userService.userSearchByEmail(email);
  }

  @Post('search/nickname')
  userSearchByNickname(@Body('nickname') nickname: string) {
    return this.userService.userSearchByNickname(nickname);
  }

  @Delete('search')
  getUserListOnDelete(@Query('page', ParseIntPipe) page: number) {
    return this.userService.getUserListOnDelete(page);
  }

  @Post('search/coin')
  searchCoinList(@Body('user_id', ParseIntPipe) user_id: number) {
    return this.userService.searchCoinList(user_id);
  }
}
