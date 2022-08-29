import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getCodyPostList(page = 1) {
    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        take: 30,
        skip: 30 * (page - 1),
        orderBy: {
          post_id: 'desc',
        },
        include: {
          user: true,
        },
      }),
      this.prisma.post.count(),
    ]);
    return { posts, lastPage: Math.ceil(count / 30) };
  }

  async codyMoveToVogue(post_id) {
    return this.prisma.vogue.create({
      data: {
        post_id,
      },
    });
  }

  async getVogueList(page = 1) {
    const [vogues, count] = await Promise.all([
      this.prisma.vogue.findMany({
        take: 30,
        skip: 30 * (page - 1),
        orderBy: [
          {
            vogue_id: 'desc',
          },
          {
            quality: 'desc',
          },
        ],
        include: {
          post: {
            include: {
              user: true,
            },
          },
        },
      }),
      this.prisma.vogue.count(),
    ]);
    return {
      vogues: vogues.map((e) => ({ ...e, ...e.post, user: e.post.user })),
      lastPage: Math.ceil(count / 30),
    };
  }

  async getReportList(page = 1) {
    const [report, count] = await Promise.all([
      this.prisma.report.findMany({
        take: 30,
        skip: 30 * (page - 1),
        include: {
          post: true,
        },
      }),
      this.prisma.report.count(),
    ]);
    return {
      report: report.map((e) => ({ ...e, ...e.post })),
      lastPage: Math.ceil(count / 30),
    };
  }

  async deleteVogue(post_id) {
    return this.prisma.vogue.delete({
      where: {
        post_id,
      },
    });
  }

  async setVogueQuality(post_id, quality) {
    return this.prisma.vogue.update({
      where: {
        post_id,
      },
      data: {
        quality,
      },
    });
  }

  async deletePost(post_id) {
    const deletedPost = await this.prisma.post.delete({
      where: {
        post_id,
      },
    });
    await Promise.all([
      this.prisma.postReward.update({
        where: {
          user_id: deletedPost.user_id,
        },
        data: {
          post: {
            decrement: 1,
          },
        },
      }),
      this.prisma.coin.update({
        where: {
          coin_id: deletedPost.user_id,
        },
        data: {
          coin: {
            decrement: 10,
          },
          coin_sum: {
            decrement: 10,
          },
        },
      }),
    ]);
    return deletedPost;
  }

  async searchPostByUserId(user_id) {
    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          user_id,
        },
        orderBy: {
          post_id: 'desc',
        },
        include: {
          user: true,
        },
      }),
      this.prisma.post.count({
        where: {
          user_id,
        },
      }),
    ]);
    return { posts, lastPage: Math.ceil(count / 30) };
  }

  async searchPostByPostId(post_id) {
    return this.prisma.post.findMany({
      where: {
        post_id: {
          gte: post_id,
        },
      },
      take: 30,
    });
  }

  async searchPostByVogueId(post_id) {
    const vogues = await this.prisma.vogue.findMany({
      where: {
        post_id: {
          gte: post_id,
        },
      },
      take: 30,
      include: {
        post: true,
      },
    });
    return vogues.map((e) => ({ e, ...e.post }));
  }

  async searchPostsByNickname(nickname: string) {
    return this.prisma.post.findMany({
      where: {
        user: {
          nickname,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        post_id: 'desc',
      },
    });
  }
}
