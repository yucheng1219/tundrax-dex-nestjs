import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { authConfig } from '~/auth/config/auth.config'
import { appConfig } from '~/config/app.config'
import { dbConfig } from '~/database/db-config'
import { UserSeedModule } from '~/database/seeds/user/user-seed.module'
import { TypeOrmConfigService } from '~/database/typeorm-config.service'

@Module({
  imports: [
    UserSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class SeedModule {}
