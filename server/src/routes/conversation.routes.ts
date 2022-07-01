import express, { Request, Response } from "express";
import authMeddleware from "../middleware/auth.meddleware";
import { AppDataSource } from "../data-source";
import { Conversation } from "../entities/Conversation";
import { In } from "typeorm";

const router = express.Router({ mergeParams: true });

router.post("/", authMeddleware, async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.body;
    const senderId = String(req.user?._id);

    const conversations = await AppDataSource.manager.find(Conversation);
    const existingConversation = conversations.find(
      (c) => c.members.includes(receiverId) && c.members.includes(senderId)
    );

    if (existingConversation) {
      return res.status(201).json({ code: 201, data: existingConversation });
    } else {
      const newCoversation = AppDataSource.manager.create(Conversation, {
        members: [senderId, receiverId],
      });

      await AppDataSource.manager.save(newCoversation);

      return res.status(201).json({ code: 201, data: newCoversation });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      code: 500,
      message: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.get("/", authMeddleware, async (req: Request, res: Response) => {
  try {
    const userId = String(req.user?._id);
    const conversations = await AppDataSource.manager.find(Conversation);
    const currentConversations = conversations.filter((c) =>
      c.members.includes(userId)
    );

    return res.status(201).json({
      code: 201,
      conversations: currentConversations,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

export = router;
