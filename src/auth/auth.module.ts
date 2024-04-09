import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "~/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "~/auth/strategy/jwt.strategy";
import { JwtRefreshStrategy } from "~/auth/strategy/jwt-refresh.strategy";
import { SessionModule } from "~/session/session.module";

@Module({
  imports: [SessionModule, UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
