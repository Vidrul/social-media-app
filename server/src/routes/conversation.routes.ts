import express, { Request, Response } from "express";
import authMeddleware from "../middleware/auth.meddleware";
import { AppDataSource } from "../data-source";
import { Conversation } from "../entities/Conversation";

const router = express.Router({ mergeParams: true });

router.post("/", authMeddleware, async (req: Request, res: Response) => {
  const conversationRepo = AppDataSource.getRepository(Conversation);
  try {
    const { receiverId } = req.body;
    const senderId = req.user?._id;

    const newCoversation = conversationRepo.create({
      members: [senderId, receiverId],
    });
    conversationRepo.save(newCoversation);

    return res.status(201).json({ code: 201, data: newCoversation });
  } catch (err) {
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
