import { registerAs } from "@nestjs/config";
import { IsString } from "class-validator";
import { validateConfig } from "~/utils/validate-config";

class VarsValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;
}

export interface AuthConfig {
  secret: string;
  expires: string;
  refreshSecret: string;
  refreshExpires: string;
}

export const authConfig = registerAs<AuthConfig>("auth", (): AuthConfig => {
  const parsed = validateConfig(process.env, VarsValidator);
  return {
    secret: parsed.AUTH_JWT_SECRET,
    expires: parsed.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: parsed.AUTH_REFRESH_SECRET,
    refreshExpires: parsed.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  };
});
