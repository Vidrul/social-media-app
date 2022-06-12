import "reflect-metadata";
import express from "express";
import cors from "cors";
import routes from "./routes";
import helmet from "helmet";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";

cloudinary.config({
  cloud_name: "dgej6y3u1",
  api_key: "345645853388837",
  api_secret: "3kNk4vlr5mDdXTTlYwRnNFdMwtM",
  secure: true,
});

const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api", routes);
app.use(helmet());
app.use(morgan("common"));

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === "production") {
} else {
  console.log("Development");
}

async function start() {
  try {
    await AppDataSource.initialize();
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
