import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '~/users/user.entity'
import { UserSeedService } from './UserSeedService'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
