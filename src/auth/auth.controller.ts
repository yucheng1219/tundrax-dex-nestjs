import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthEmailLoginDto, AuthRegisterLoginDto } from '~/auth/dto'
import type { JwtPayload, JwtRefreshPayload } from '~/auth/strategy/types'
import type { User } from '~/users/domain/user.domain'
import { AuthService } from './auth.service'
import type { LoginResponseType } from './types'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthEmailLoginDto) {
    return this.authService.login(dto)
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthRegisterLoginDto) {
    return this.authService.register(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Req() request: { user: JwtPayload }): Promise<void> {
    await this.authService.logout({
      sessionId: request.user.sessionId,
    })
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public me(@Req() request: { user: JwtPayload }): Promise<User | null> {
    return this.authService.me(request.user)
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(
    @Req() request: { user: JwtRefreshPayload }
  ): Promise<Omit<LoginResponseType, 'user'>> {
    return this.authService.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    })
  }
}
