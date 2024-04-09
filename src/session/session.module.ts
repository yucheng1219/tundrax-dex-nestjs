import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionEntity } from './session.entity'
import { SessionService } from './session.service'

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
