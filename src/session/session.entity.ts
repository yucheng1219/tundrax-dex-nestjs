import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { Session } from "./domain/session";
import { UserEntity } from "~/users/user.entity";

@Entity({
  name: "session",
})
export class SessionEntity implements Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  user: UserEntity;

  @Column()
  hash: string;
}
