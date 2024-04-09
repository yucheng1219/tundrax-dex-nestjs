import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { JwtPayload } from '~/auth/strategy/types'
import type { AllConfigType } from '~/config/config.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret', {
        infer: true,
      }),
    })
  }

  validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
