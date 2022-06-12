import express, { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { check, validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import tokenService from "..//service/token.service";

const router = express.Router({ mergeParams: true });

router.post(
  "/signUp",
  [
    check("email", "Некорректный Email").isEmail(),
    check("password", "Минимальное кол-во символов 8").isLength({ min: 8 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        return res.status(400).json({
          error: {
            message: "INVALID_DATA",
            code: 400,
            errors: erros.array(),
          },
        });
      }

      const { email, password } = req.body;
      const existingUser = await userRepository.findOneBy({ email });

      if (existingUser) {
        return res.status(400).json({
          error: {
            message: "EMAIL_EXISTS",
            code: 400,
          },
        });
      }

      const hashedPassword = await bcryptjs.hash(password, 12);

      const newUser = userRepository.create({
        ...req.body,
        profilePicture:
          "https://res.cloudinary.com/dgej6y3u1/image/upload/v1653557137/default_user_icon.png",
        password: hashedPassword,
      } as User);

      await userRepository.save(newUser);

      const tokens = tokenService.generate({ _id: newUser.id });
      await tokenService.save(newUser.id, tokens.refreshToken);

      return res.status(201).json({
        ...tokens,
        userId: newUser.id,
      });
    } catch (error) {
      return res.status(500).json({
        message: "На сервере произошла ошибка попробуйте позже.",
      });
    }
  }
);

router.post(
  "/signInWithPassword",
  [
    check("email", "Некорректный Email").isEmail(),
    check("password", "Минимальное кол-во символов 8").isLength({ min: 8 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        return res.status(400).json({
          error: {
            message: "INVALID_DATA",
            code: 400,
            errors: erros.array(),
          },
        });
      }

      const { email, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOneBy({ email });

      if (!existingUser) {
        return res.status(400).json({
          error: {
            message: "EMAIL_NOT_FOUND",
            code: 400,
          },
        });
      }
      console.log(password);

      const comparePassword = await bcryptjs.compare(
        password,
        existingUser.password
      );

      if (!comparePassword) {
        return res.status(400).json({
          error: {
            message: "INVALID_PASSWORD",
            code: 400,
          },
        });
      }

      const tokens = tokenService.generate({ _id: existingUser.id });
      await tokenService.save(existingUser.id, tokens.refreshToken);

      return res.status(201).json({
        ...tokens,
        userId: existingUser.id,
      });
    } catch (error) {
      return res.status(500).json({
        message: "На сервере произошла ошибка попробуйте позже.",
      });
    }
  }
);

router.post("/token", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const data = tokenService.validateRefresh(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);

    if (tokenService.isTokenInvalid(data, dbToken)) {
      return res.status(401).json({
        message: "Unautorized",
      });
    }

    const tokens = tokenService.generate({
      _id: data?._id,
    });

    if (data) {
      await tokenService.save(data._id, tokens.refreshToken);
    }

    return res.status(200).send({ ...tokens, userId: data?._id });
  } catch (error) {
    return res.status(500).json({
      message: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

export = router;
