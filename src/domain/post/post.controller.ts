import {
  Body,
  Post,
  Controller,
  Delete,
  ParseIntPipe,
  UseGuards,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../../util/jwt/jwt.guard';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getCodyPostList(@Query('page', ParseIntPipe) page) {
    return this.postService.getCodyPostList(page);
  }

  @Get('vogue')
  getVogueList(@Query('page', ParseIntPipe) page) {
    return this.postService.getVogueList(page);
  }

  @Get('report')
  getReportList(@Query('page', ParseIntPipe) page) {
    return this.postService.getReportList(page);
  }

  @Post('vogue')
  codyMoveToVogue(@Body('post_id', ParseIntPipe) post_id) {
    return this.postService.codyMoveToVogue(post_id);
  }

  @Delete('vogue')
  deleteVogue(@Body('post_id', ParseIntPipe) post_id) {
    return this.postService.deleteVogue(post_id);
  }

  @Patch('vogue')
  setVogueQuality(
    @Body('post_id', ParseIntPipe) post_id,
    @Body('quality', ParseIntPipe) quality,
  ) {
    return this.postService.setVogueQuality(post_id, quality);
  }

  @Delete()
  deletePost(@Body('post_id', ParseIntPipe) post_id) {
    return this.postService.deletePost(post_id);
  }

  @Post('/search/userId')
  searchPostByUserId(@Body('user_id', ParseIntPipe) user_id: number) {
    return this.postService.searchPostByUserId(user_id);
  }

  @Post('/search/postId')
  searchPostByPostId(@Body('post_id', ParseIntPipe) post_id: number) {
    return this.postService.searchPostByPostId(post_id);
  }

  @Post('/search/vogue')
  searchPostByVogueId(@Body('post_id', ParseIntPipe) post_id: number) {
    return this.postService.searchPostByVogueId(post_id);
  }

  @Post('/search/nickname')
  searchPostsByNickname(@Body('nickname') nickname) {
    return this.postService.searchPostsByNickname(nickname);
  }
}
