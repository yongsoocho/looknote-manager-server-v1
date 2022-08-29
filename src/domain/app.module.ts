import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {UserModule} from "./user/user.moduel";
import {PostModule} from "./post/post.moduel";
import {ManagerModule} from "./manager/manager.moduel";
import {PrismaModule} from "../common/prisma/prisma.module";
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
        UserModule,
        PostModule,
        ManagerModule,
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
