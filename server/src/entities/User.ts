import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ default: "" })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: "" })
  profilePicture: string;

  @Column({ default: "" })
  coverPicture: string;

  @Column("text", { array: true, default: [] })
  followers: string[];

  @Column("text", { array: true, default: [] })
  followings: string[];

  @Column({ type: "boolean", default: false })
  isAdmin: false;

  @Column({ default: "" })
  desc: string;

  @Column({ default: "" })
  city: string;

  @Column({ default: "" })
  from: string;
}
