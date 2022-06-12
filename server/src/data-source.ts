import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Token } from "./entities/Token";
import { Post } from "./entities/Post";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "95078",
  database: "mediaApp",
  synchronize: true,
  logging: true,
  entities: [User, Token, Post],
});
