import { User } from '~/users/domain/user.domain'
import { UserEntity } from '~/users/user.entity'

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const user = new User()
    user.id = entity.id
    user.email = entity.email
    // This is safe because it's excluded before serialization
    user.password = entity.password
    user.fullName = entity.fullName
    return user
  }

  static toPersistence(user: User): UserEntity {
    const userEntity = new UserEntity()
    userEntity.id = user.id
    userEntity.email = user.email
    userEntity.password = user.password
    userEntity.role = user.role
    userEntity.fullName = user.fullName
    return userEntity
  }
}
