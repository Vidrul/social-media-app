import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { array: true, default: [] })
  members: string[];
}

export default new Conversation();
