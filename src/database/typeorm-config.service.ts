import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import type { AllConfigType } from '~/config/config.type'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get<string>('database.password', {
        infer: true,
      }) as string,
      database: this.configService.get<string>('database.name', {
        infer: true,
      }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get('database.rejectUnauthorized', {
                infer: true,
              }),
              ca: this.configService.get('database.ca', { infer: true }) ?? undefined,
              key: this.configService.get('database.key', { infer: true }) ?? undefined,
              cert: this.configService.get('database.cert', { infer: true }) ?? undefined,
            }
          : undefined,
      },
    }
  }
}
