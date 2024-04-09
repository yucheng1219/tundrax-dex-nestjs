import type { AuthConfig } from '~/auth/config/auth.config'
import type { DBConfig } from '~/database/db-config'
import type { AppConfig } from './app.config'

export interface AllConfigType {
  app: AppConfig
  auth: AuthConfig
  database: DBConfig
}
