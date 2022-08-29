import {Module} from '@nestjs/common';
import {PrismaModule} from "../../common/prisma/prisma.module";
import {ManagerController} from "./manager.controller";
import {ManagerService} from "./manager.service";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "../../util/jwt/jwt.strategy";

@Module({
    imports: [PrismaModule, PassportModule, JwtModule.register({
        secret: process.env.JWT_SECRET
    })],
    controllers: [ManagerController],
    providers: [ManagerService, JwtStrategy],
})
export class ManagerModule {
}
