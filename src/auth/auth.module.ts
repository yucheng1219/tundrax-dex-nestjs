import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtRefreshStrategy } from '~/auth/strategy/jwt-refresh.strategy'
import { JwtStrategy } from '~/auth/strategy/jwt.strategy'
import { SessionModule } from '~/session/session.module'
import { UsersModule } from '~/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [SessionModule, UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
