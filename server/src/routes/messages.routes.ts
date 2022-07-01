import express, { Request, Response } from "express";
import authMeddleware from "../middleware/auth.meddleware";
import { AppDataSource } from "../data-source";
import { Message } from "../entities/Message";

const router = express.Router({ mergeParams: true });

router.post("/", authMeddleware, async (req: Request, res: Response) => {
  const conversationRepo = AppDataSource.getRepository(Message);
  try {
    const { text, conversationId } = req.body;
    const newMessage = conversationRepo.create({
      conversationId,
      text,
      sender: req.user?._id,
    });
    conversationRepo.save(newMessage);

    return res.status(201).json({ code: 201, data: newMessage });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.get(
  "/:conversationId",
  authMeddleware,
  async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;

      if (conversationId) {
        const messages = await AppDataSource.manager.findBy(Message, {
          conversationId,
        });

        return res.status(200).json({
          code: 200,
          messages,
        });
      } else {
        return res.status(200).json({
          code: 200,
          messages: null,
        });
      }
    } catch (err) {
      return res.status(500).json({
        code: 500,
        error: "На сервере произошла ошибка попробуйте позже.",
      });
    }
  }
);

export = router;
