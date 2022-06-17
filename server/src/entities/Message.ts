import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Conversation } from "./Conversation";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: string;

  @ManyToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;

  @Column()
  sender: number;

  @Column()
  text: string;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;
}

export default new Message();
