import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ResolvePromisesInterceptor } from '~/common/interceptors/serializer.interceptor'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { TransformInterceptor } from './interceptors/transform.interceptor'

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResolvePromisesInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class CoreModule {}
