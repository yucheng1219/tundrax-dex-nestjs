import type { Session } from '~/session/domain/session'
import type { User } from '~/users/domain/user.domain'

export interface JwtPayload extends Pick<User, 'id' | 'role'> {
  sub: string
  sessionId: Session['id']
  iat: number
  exp: number
}

export interface JwtRefreshPayload {
  sessionId: Session['id']
  hash: Session['hash']
  iat: number
  exp: number
}
