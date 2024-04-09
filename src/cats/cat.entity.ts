import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "cat",
})
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;
}
