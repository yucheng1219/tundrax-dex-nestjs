import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from '~/common/decorators/roles.decorator'
import type { User } from '~/users/domain/user.domain'
import { UserEntity } from '~/users/user.entity'
import { bcryptHash } from '~/utils/bcrypt'

export const adminSeedUser: Omit<User, 'id'> = {
  fullName: 'SuperAdmin',
  email: 'admin@example.com',
  password: 'admin-secret',
  role: Role.Admin,
}

export const normalSeedUser: Omit<User, 'id'> = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  password: 'secret',
  role: Role.User,
}

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: Role.Admin,
      },
    })

    if (!countAdmin) {
      const password = await bcryptHash(adminSeedUser.password)
      await this.repository.save(this.repository.create({ ...adminSeedUser, password }))
    }

    const countUser = await this.repository.count({
      where: {
        role: Role.User,
      },
    })

    if (!countUser) {
      const password = await bcryptHash(normalSeedUser.password)
      await this.repository.save(this.repository.create({ ...normalSeedUser, password }))
    }
  }
}
