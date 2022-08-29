import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { transporter } from '../util/mailer/mailer';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async errorSend() {
    transporter
      .sendMail({
        from: '<LookNote> looknote.official@befferent.co.kr',
        to: 'looknote.official@befferent.co.kr',
        subject: '[LookNote 서버 에러 로그]',
        attachments: [
          {
            filename: 'log.txt',
            path: path.join(process.cwd(), 'log.txt'),
          },
        ],
      })
      .then((res) => {
        console.log(res);
        fs.unlink(path.join(process.cwd(), 'log.txt'), (error) => {
          if (error) {
            console.log(error);
            throw new HttpException(
              'error send is broken',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
          return fs.writeFile(
            path.join(process.cwd(), 'log.txt'),
            `envelopeTime:${res.envelopeTime} messageTime:${res.messageTime}`,
            'utf8',
            (error) => {
              if (error) {
                console.log(error);
                throw new HttpException(
                  'file create is broken',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              }
            },
          );
          return {
            statusCode: HttpStatus.OK,
            message: 'error send success',
          };
        });
      });
  }

  async errorLog(errorMessage, metaData = 'ec2') {
    fs.appendFile(
      path.join(process.cwd(), 'log.txt'),
      `${new Date()}\n${metaData}\n${errorMessage}\n\n\n`,
      'utf8',
      (error) => {
        if (error) {
          console.log(error);
          throw new HttpException(
            'error log is broken',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'error log success',
    };
  }

  async managerUpdate() {
    const posts = await this.prisma.post.findMany({
      select: {
        post_id: true,
        imageURL: true,
      },
    });
    return await posts.map(async (e) => {
      return await this.prisma.post.update({
        where: {
          post_id: e.post_id,
        },
        data: {
          imageURL: [
            e.imageURL[0]
              .split('.')
              .map((e) => {
                if (e === 'jpeg' || e === 'jpg' || e === 'png') {
                  return 'webp';
                } else {
                  return e;
                }
              })
              .join('.'),
          ],
        },
      });
    });
  }

  async managerQuery() {
    const posts = await this.prisma.post.findMany({
      where: {
        scrap: {
          lt: 0,
        },
      },
      select: {
        post_id: true,
      },
    });
    return await posts.map(async (e) => {
      return await this.prisma.post.update({
        where: {
          post_id: e.post_id,
        },
        data: {
          scrap: 0,
        },
      });
    });
  }
}
