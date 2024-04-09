import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import type { JwtRefreshPayload } from "./types";
import type { AllConfigType } from "~/config/config.type";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("auth.refreshSecret", { infer: true }),
    });
  }

  validate(payload: JwtRefreshPayload): JwtRefreshPayload {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
