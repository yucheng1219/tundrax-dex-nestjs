import { Exclude } from 'class-transformer'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from '~/common/decorators/roles.decorator'
import type { User } from './domain/user.domain'

@Entity({
  name: 'user',
})
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string

  @Index()
  @Column()
  fullName: string

  @Column()
  role: Role
}
