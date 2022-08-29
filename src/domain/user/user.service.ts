import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserListWithPagenation(page = 1) {
    const [users, count] = await Promise.all([
      this.prisma.user.findMany({
        take: 30,
        skip: 30 * (page - 1),
        orderBy: {
          user_id: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);
    return { users, lastPage: Math.ceil(count / 30) };
  }

  async deleteUser(user_id) {
    return this.prisma.user.delete({
      where: {
        user_id,
      },
    });
  }

  async getQuitUserList(page = 1) {
    const [quits, count] = await Promise.all([
      this.prisma.quit.findMany({
        take: 30,
        skip: 30 * (page - 1),
        include: {
          user: true,
        },
      }),
      this.prisma.quit.count(),
    ]);
    return { quits, lastPage: Math.ceil(count / 30) };
  }

  async searchQuitWithEmail(email: string) {
    return this.prisma.quit.findUnique({
      where: {
        email,
      },
    });
  }

  async undoWithdraw(user_id) {
    await this.prisma.user.update({
      where: {
        user_id,
      },
      data: {
        active: true,
      },
    });
    return this.prisma.quit.delete({
      where: {
        user_id,
      },
    });
  }

  async getCoinList(page = 1) {
    const [coinList, count] = await Promise.all([
      this.prisma.coin.findMany({
        take: 30,
        skip: 30 * (page - 1),
        include: {
          user: true,
        },
        orderBy: {
          coin_id: 'desc',
        },
      }),
      this.prisma.coin.count(),
    ]);
    return { coinList, lastPage: Math.ceil(count / 30) };
  }

  async getPostRewardList(page = 1) {
    const [coinList, count] = await Promise.all([
      this.prisma.postReward.findMany({
        take: 30,
        skip: 30 * (page - 1),
        include: {
          user: {
            include: {
              coin: true,
            },
          },
        },
        orderBy: [
          {
            post: 'desc',
          },
          { user_id: 'desc' },
        ],
      }),
      this.prisma.postReward.count(),
    ]);
    return {
      coinList: coinList.map((e) => ({ ...e, ...e.user.coin })),
      lastPage: Math.ceil(count / 30),
    };
  }

  async givePointToUser(user_id, coin) {
    return this.prisma.coin.update({
      where: {
        coin_id: user_id,
      },
      data: {
        coin: {
          increment: coin,
        },
        coin_sum: {
          increment: coin,
        },
      },
    });
  }

  async minusUserCoin(user_id, coin) {
    return this.prisma.coin.update({
      where: {
        coin_id: user_id,
      },
      data: {
        coin: {
          decrement: coin,
        },
      },
    });
  }

  async setUserPoint(user_id, coin, coin_sum) {
    return this.prisma.coin.update({
      where: {
        coin_id: user_id,
      },
      data: {
        coin,
        coin_sum,
      },
    });
  }

  async userPasswordReset(email, provider) {
    const hash = await bcrypt.hash('0000', 10);
    return this.prisma.user.updateMany({
      where: {
        email,
        provider,
      },
      data: {
        password: hash,
      },
    });
  }

  async userSearchByUserId(user_id) {
    return this.prisma.user.findUnique({
      where: {
        user_id,
      },
      include: {
        coin: true,
      },
    });
  }

  async userSearchByEmail(email) {
    const data = await this.prisma.user.findMany({
      where: {
        email,
      },
      include: {
        coin: true,
      },
    });
    return data.map((e) => ({
      ...e,
      ...e.coin,
      user: e,
    }));
  }

  async userSearchByNickname(nickname) {
    return this.prisma.user.findUnique({
      where: {
        nickname,
      },
      include: {
        coin: true,
      },
    });
  }

  async getUserListOnDelete(page = 1) {
    const [users, count] = await Promise.all([
      this.prisma.quit.findMany({
        take: 30,
        skip: 30 * (page - 1),
        include: {
          user: true,
        },
      }),
      this.prisma.quit.count(),
    ]);
    return { users, lastPage: Math.ceil(count / 30) };
  }

  async searchCoinList(user_id: number) {
    return this.prisma.coin.findMany({
      where: {
        coin_id: {
          gte: user_id,
        },
      },
      take: 30,
      include: {
        user: true,
      },
    });
  }
}
