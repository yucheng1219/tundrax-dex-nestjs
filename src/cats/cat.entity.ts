import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import type { Cat } from './domain/cat.domain'

@Entity({
  name: 'cat',
})
export class CatEntity implements Cat {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  age: number

  @Column()
  breed: string
}
