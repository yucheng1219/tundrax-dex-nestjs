import { registerAs } from '@nestjs/config'
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { validateConfig } from '~/utils/validate-config'

class VarsValidator {
  @IsString()
  DATABASE_HOST: string

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  DATABASE_PORT?: number

  @IsString()
  DATABASE_PASSWORD: string

  @IsString()
  DATABASE_NAME: string

  @IsString()
  DATABASE_USERNAME: string

  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  DATABASE_MAX_CONNECTIONS?: number

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: boolean

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean

  @IsString()
  @IsOptional()
  DATABASE_CA?: string

  @IsString()
  @IsOptional()
  DATABASE_KEY?: string

  @IsString()
  @IsOptional()
  DATABASE_CERT?: string
}

export interface DBConfig {
  host: string
  port: number
  username: string
  password: string
  name: string
  synchronize: boolean
  maxConnections: number
  sslEnabled?: boolean
  rejectUnauthorized?: boolean
  ca?: string
  key?: string
  cert?: string
}

export const dbConfig = registerAs<DBConfig>('database', () => {
  const parsed = validateConfig(
    {
      ...process.env,
      DATABASE_SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE === 'true',
      DATABASE_SSL_ENABLED: process.env.DATABASE_SSL_ENABLED === 'true',
      DATABASE_REJECT_UNAUTHORIZED: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    },
    VarsValidator
  )

  return {
    host: parsed.DATABASE_HOST,
    port: parsed.DATABASE_PORT ?? 5432,
    username: parsed.DATABASE_USERNAME,
    password: parsed.DATABASE_PASSWORD,
    name: parsed.DATABASE_NAME,
    synchronize: parsed.DATABASE_SYNCHRONIZE,
    maxConnections: parsed.DATABASE_MAX_CONNECTIONS ?? 100,
    sslEnabled: parsed.DATABASE_SSL_ENABLED,
    rejectUnauthorized: parsed.DATABASE_REJECT_UNAUTHORIZED,
    ca: parsed.DATABASE_CA,
    key: parsed.DATABASE_KEY,
    cert: parsed.DATABASE_CERT,
  }
})
