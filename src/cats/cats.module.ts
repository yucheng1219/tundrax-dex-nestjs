import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CatEntity } from './cat.entity'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

@Module({
  imports: [TypeOrmModule.forFeature([CatEntity])],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
