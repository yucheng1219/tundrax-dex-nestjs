import { UserEntity } from '~/users/user.entity'
import { UserMapper } from '~/users/user.mapper'
import { Session } from './domain/session'
import { SessionEntity } from './session.entity'

export class SessionMapper {
  static toDomain(raw: SessionEntity) {
    const session = new Session()
    session.id = raw.id
    if (raw.user) {
      session.user = UserMapper.toDomain(raw.user)
    }
    session.hash = raw.hash
    return session
  }

  static toPersistence(session: Session): SessionEntity {
    const userEntity = new UserEntity()
    userEntity.id = session.user.id

    const sessionEntity = new SessionEntity()

    sessionEntity.id = session.id
    sessionEntity.user = userEntity
    sessionEntity.hash = session.hash
    return sessionEntity
  }
}
