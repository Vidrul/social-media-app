import "reflect-metadata";
import express from "express";
import cors from "cors";
import routes from "./routes";
import helmet from "helmet";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import { Server } from "socket.io";

cloudinary.config({
  cloud_name: "dgej6y3u1",
  api_key: "345645853388837",
  api_secret: "3kNk4vlr5mDdXTTlYwRnNFdMwtM",
  secure: true,
});

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

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
    server.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

//Socket IO
const users: { userId: string; socketId: string }[] = [];

const addUser = (userId: string, socketId: string) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("joinConversation", ({ conversationId }) => {
    socket.join(conversationId);
  });

  socket.on("sendMessage", ({ sender, conversationId, text }) => {
    io.in(conversationId).emit("getMessage", {
      sender,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    // removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

start();
