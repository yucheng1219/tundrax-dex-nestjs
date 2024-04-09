import { registerAs } from '@nestjs/config'
import { IsEnum } from 'class-validator'
import { validateConfig } from '~/utils/validate-config'

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface AppConfig {
  nodeEnv: Environment
}

class VarsValidator {
  @IsEnum(Environment)
  NODE_ENV: Environment
}

export const appConfig = registerAs<AppConfig>('app', () => {
  const parsed = validateConfig(process.env, VarsValidator)
  return {
    nodeEnv: parsed.NODE_ENV,
  }
})
