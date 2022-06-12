import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Column()
  refreshToken: string;
}

export default new Token();
