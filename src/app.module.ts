import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module";

import { ConfigModule } from "@nestjs/config";
import { dbConfig } from "./database/db-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import { CoreModule } from "./core/core.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SessionModule } from "./session/session.module";
import { appConfig } from "~/config/app.config";
import { authConfig } from "~/auth/config/auth.config";

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
    AuthModule,
    UsersModule,
    CatsModule,
    SessionModule,
  ],
})
export class AppModule {}
