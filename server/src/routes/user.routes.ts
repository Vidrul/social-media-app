import express, { Request, Response } from "express";
import authMeddleware from "../middleware/auth.meddleware";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router({ mergeParams: true });

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await AppDataSource.getRepository(User).findOneBy({
      id: Number(userId),
    });

    return res.status(201).json({ ...user, password: null });
  } catch (error) {
    return res.status(500).json({
      message: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.get("/searchUsers/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const users = await AppDataSource.manager.find(User);
    const filteredUsers = users.filter((user) =>
      user.firstName.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    );

    return res.status(201).json({
      data: filteredUsers,
      code: 201,
    });
  } catch (error) {
    return res.status(500).json({
      message: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.delete(
  "/:userId",
  authMeddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (req.user?._id === Number(userId) || req.body.isAdmin) {
        await AppDataSource.getRepository(User).delete(Number(userId));
        return res.status(201).json("Account has been deleted");
      }

      return res.status(403).json("You can delete only your account!");
    } catch (error) {
      return res.status(500).json({
        message: "На сервере произошла ошибка попробуйте позже.",
      });
    }
  }
);

router.put("/", authMeddleware, async (req: Request, res: Response) => {
  try {
    const { profilePicture, coverPicture, firstName, lastName, city, from } =
      req.body;
    const userId = req.user?._id;

    if (req.user?._id === Number(userId) || req.body.isAdmin) {
      const existingUser = await AppDataSource.manager.findOneBy(User, {
        id: Number(userId),
      });

      if (!existingUser) {
        return res.status(400).json({
          message: "User data has not been updated!",
          type: "error",
          code: 400,
        });
      }

      if (profilePicture) {
        await cloudinary.uploader.upload(
          profilePicture,
          {
            resource_type: "image",
            public_id: `users/${userId}/profilePicture`,
            overwrite: true,
          },
          async (err, res) => {
            existingUser.profilePicture = res?.url || "";
            await AppDataSource.manager.save(existingUser);
          }
        );
      }

      if (coverPicture) {
        await cloudinary.uploader.upload(
          coverPicture,
          {
            resource_type: "image",
            public_id: `users/${userId}/coverPicture`,
            overwrite: true,
          },
          async (err, res) => {
            existingUser.coverPicture = res?.url || "";
            await AppDataSource.manager.save(existingUser);
          }
        );
      } else {
        cloudinary.uploader.destroy(`users/${userId}/coverPicture`);
        existingUser.coverPicture = "";
        await AppDataSource.manager.save(existingUser);
      }

      const user = await AppDataSource.getRepository(User).update(
        String(userId),
        { firstName, lastName, city, from }
      );

      return res.status(201).json({
        message: "User data has been updated!",
        hzWhatisIt: user,
        type: "success",
        code: 201,
      });
    }

    return res.status(403).json("You can update only your account!");
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.put(
  "/followOrUnfollow/:userId",
  authMeddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (req.user?._id === Number(userId)) {
        return res.status(403).json("you cant follow yourself");
      }

      const existingUser = await AppDataSource.manager.findOneBy(User, {
        id: Number(userId),
      });

      const currentUser = await AppDataSource.manager.findOneBy(User, {
        id: req.user?._id,
      });

      if (!existingUser?.followers.includes(req.user?._id.toString() || "")) {
        existingUser?.followers.push(req.user?._id.toString() || "");
        currentUser?.followings.push(String(userId));

        await AppDataSource.manager.save(existingUser);
        await AppDataSource.manager.save(currentUser);

        return res
          .status(200)
          .json({ message: "user has been followed", code: 200 });
      } else {
        existingUser.followers = existingUser?.followers.filter(
          (id) => id !== String(req.user?._id)
        );

        if (currentUser?.followings)
          currentUser.followings = currentUser?.followings.filter(
            (id) => id !== String(userId)
          );

        await AppDataSource.manager.save(existingUser);
        await AppDataSource.manager.save(currentUser);

        return res
          .status(200)
          .json({ message: "user has been unfollowed", code: 200 });
      }
    } catch (error) {
      return res.status(500).json({
        message: "На сервере произошла ошибка попробуйте позже.",
      });
    }
  }
);

router.get(
  "/followings/:userId",
  authMeddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await AppDataSource.manager.findOneBy(User, {
        id: Number(userId),
      });

      if (user) {
        const friends = await Promise.all(
          user.followings.map(async (friendId) => {
            const friend = await AppDataSource.getRepository(User).findOneBy({
              id: Number(friendId),
            });
            return {
              id: friend?.id,
              username: friend?.firstName,
              profilePicture: friend?.profilePicture,
            };
          })
        );

        return res.status(200).json({ code: 200, array: friends });
      }

      return res
        .status(403)
        .json({ code: 403, messsage: "User dosen't exist" });
    } catch (err) {
      return res.status(500).json({ code: 500, data: err });
    }
  }
);

export = router;
