import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthEmailLoginDto, AuthRegisterLoginDto } from "~/auth/dto";
import { AuthGuard } from "@nestjs/passport";
import type { LoginResponseType } from "./types";
import type { JwtPayload, JwtRefreshPayload } from "~/auth/strategy/types";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthEmailLoginDto) {
    return this.authService.login(dto);
  }

  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthRegisterLoginDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Req() request: { user: JwtPayload }): Promise<void> {
    await this.authService.logout({
      sessionId: request.user.sessionId,
    });
  }

  @Post("refresh")
  @UseGuards(AuthGuard("jwt-refresh"))
  @HttpCode(HttpStatus.OK)
  public refresh(
    @Req() request: { user: JwtRefreshPayload }
  ): Promise<Omit<LoginResponseType, "user">> {
    return this.authService.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }
}