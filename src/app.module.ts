import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { authConfig } from '~/auth/config/auth.config'
import { appConfig } from '~/config/app.config'
import { AuthModule } from './auth/auth.module'
import { CatsModule } from './cats/cats.module'
import { CoreModule } from './core/core.module'
import { dbConfig } from './database/db-config'
import { TypeOrmConfigService } from './database/typeorm-config.service'
import { SessionModule } from './session/session.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CoreModule,
    UsersModule,
    AuthModule,
    CatsModule,
    SessionModule,
  ],
})
export class AppModule {}
