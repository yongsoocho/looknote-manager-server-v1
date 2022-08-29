import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class ManagerService {
  constructor(private readonly prisma: PrismaService,private readonly  jwtService: JwtService) {}

  async getManagerList(page = 1) {
    const [managers, count] = await Promise.all([
      this.prisma.manager.findMany({
        take: 30,
        skip: 30 * (page - 1),
      }),
      this.prisma.manager.count(),
    ]);
    return { managers, lastPage: Math.ceil(count / 30) };
  }

  async managerLogin(mangerLoginBody) {
    const manager = await this.prisma.manager.findUnique({
      where: {
        email: mangerLoginBody.email,
      },
    });
    if (!manager) {
      throw new HttpException('invalid email', HttpStatus.NOT_FOUND);
    }
    const result = await bcrypt.compare(
      mangerLoginBody.password,
      manager.password,
    );
    if (!result) {
      throw new HttpException('invalid password', HttpStatus.FORBIDDEN);
    }
    return { manager, token: this.jwtService.sign(manager)};
  }

  async createManager(managerCreateBody, user) {
    const hash = await bcrypt.hash(managerCreateBody.password, 10)
    return this.prisma.manager.create({
      data: {
        ...managerCreateBody,
        admin: true,
        password: hash,
        creator: user.name,
      },
    });
  }

  async deleteManager(manager_id) {
    return this.prisma.manager.delete({
      where: {
        manager_id
      }
    });
  }
}
