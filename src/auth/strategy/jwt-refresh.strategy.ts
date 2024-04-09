import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { AllConfigType } from '~/config/config.type'
import type { JwtRefreshPayload } from './types'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.refreshSecret', { infer: true }),
    })
  }

  validate(payload: JwtRefreshPayload): JwtRefreshPayload {
    if (!payload.sessionId) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
