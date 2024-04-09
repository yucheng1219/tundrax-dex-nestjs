import type { ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '~/auth/auth.module'
import { authConfig } from '~/auth/config/auth.config'
import { appConfig } from '~/config/app.config'
import { CoreModule } from '~/core/core.module'
import { mkTestDBOptions } from './mk-test-data-source'

export const mkTestModule = (imports: Required<ModuleMetadata>['imports']) => {
  const result = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [appConfig, authConfig],
      }),
      TypeOrmModule.forRoot({
        ...mkTestDBOptions(),
        autoLoadEntities: true,
      }),
      AuthModule,
      ...imports,
      CoreModule,
    ],
  })
  return result
}
