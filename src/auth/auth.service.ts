import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'crypto'
import ms from 'ms'
import { Not } from 'typeorm'
import type { AuthEmailLoginDto, AuthRegisterLoginDto, AuthUpdateDto } from '~/auth/dto'
import type { JwtPayload, JwtRefreshPayload } from '~/auth/strategy/types'
import type { Role } from '~/common/decorators/roles.decorator'
import type { AllConfigType } from '~/config/config.type'
import type { Session } from '~/session/domain/session'
import { SessionService } from '~/session/session.service'
import { UsersService } from '~/users/users.service'
import { bcryptCheckHash } from '~/utils/bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService
  ) {}

  async login(dto: AuthEmailLoginDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException()
    }
    const isPasswordMatch = await bcryptCheckHash(dto.password, user?.password)
    if (!isPasswordMatch) {
      throw new UnauthorizedException()
    }
    const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex')

    const session = await this.sessionService.create({
      user,
      hash,
    })

    const { token, refreshToken, tokenExpires } = await this.generateTokens({
      id: session.user.id,
      role: session.user.role,
      email: session.user.email,
      sessionId: session.id,
      hash,
    })

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    }
  }

  async register(dto: AuthRegisterLoginDto) {
    return this.usersService.create({
      ...dto,
    })
  }

  async refreshToken(data: Pick<JwtRefreshPayload, 'sessionId' | 'hash'>) {
    const session = await this.sessionService.findOne({
      id: Number(data.sessionId),
    })

    if (!session) {
      throw new UnauthorizedException()
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException()
    }

    const user = await this.usersService.findOne(session.user.id)
    if (!user) {
      throw new UnauthorizedException()
    }

    const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex')

    await this.sessionService.update(session.id, {
      hash,
    })

    const { token, refreshToken, tokenExpires } = await this.generateTokens({
      id: session.user.id,
      role: session.user.role,
      email: session.user.email,
      sessionId: session.id,
      hash,
    })

    return {
      token,
      refreshToken,
      tokenExpires,
    }
  }

  private async generateTokens(data: {
    id: number
    email: string
    role: Role
    sessionId: Session['id']
    hash: Session['hash']
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    })
    const tokenExpires = Date.now() + ms(tokenExpiresIn)
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', {
            infer: true,
          }),
          expiresIn: tokenExpires,
          subject: data.email,
        }
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn:
            Date.now() +
            ms(
              this.configService.getOrThrow('auth.refreshExpires', {
                infer: true,
              })
            ),
          subject: data.email,
        }
      ),
    ])
    return {
      token,
      refreshToken,
      tokenExpires,
    }
  }

  async logout(data: Pick<JwtRefreshPayload, 'sessionId'>) {
    return this.sessionService.delete({ id: data.sessionId })
  }

  async me(userJwt: JwtPayload) {
    return this.usersService.findOne(userJwt.id)
  }

  async update(userJwt: JwtPayload, dto: AuthUpdateDto) {
    if (dto.password) {
      if (!dto.oldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'missingOldPassword',
          },
        })
      }
      const currentUser = await this.usersService.findOne(userJwt.id)
      if (!currentUser) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'userNotFound',
          },
        })
      }
      if (!currentUser.password) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        })
      }

      const isOldPasswordValid = await bcryptCheckHash(dto.oldPassword, currentUser.password)
      if (!isOldPasswordValid) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        })
      }
      // Delete other active sessions to trigger logout
      await this.sessionService.delete({
        user: {
          id: currentUser.id,
        },
        id: Not(userJwt.sessionId),
      })

      await this.usersService.update(userJwt.id, dto)
    }
  }
}
