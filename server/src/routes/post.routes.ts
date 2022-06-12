import express, { Request, Response } from "express";
import authMeddleware from "../middleware/auth.meddleware";
import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router({ mergeParams: true });

router.post("/", authMeddleware, async (req: Request, res: Response) => {
  const postRepo = AppDataSource.getRepository(Post);
  try {
    const { img, desc } = req.body;
    const newPost = postRepo.create({ desc, userId: req.user?._id });
    await postRepo.save(newPost);

    if (img) {
      await cloudinary.uploader.upload(
        img,
        {
          resource_type: "image",
          public_id: `posts/${newPost.id}`,
          overwrite: true,
        },
        async (err, res) => {
          newPost.img = res?.url || "";
          await postRepo.save(newPost);
        }
      );
    }

    return res.status(200).json({
      post: newPost,
      code: 200,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.put("/:id", authMeddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await AppDataSource.getRepository(Post).findOneBy({
      id: Number(id),
    });

    console.log(req.user?._id, id);

    if (req.user?._id !== post?.userId) {
      return res
        .status(403)
        .json({ message: "you can update only your post", code: 403 });
    }

    await AppDataSource.getRepository(Post).update(id, req.body);

    return res
      .status(200)
      .json({ message: "the post has been updated", code: 200 });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.delete("/:id", authMeddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await AppDataSource.getRepository(Post).findOneBy({
      id: Number(id),
    });

    if (req.user?._id !== post?.userId) {
      return res
        .status(403)
        .json({ message: "you can delete only your post", code: 403 });
    }

    await AppDataSource.getRepository(Post).delete(Number(id));

    cloudinary.uploader.destroy(`posts/${id}`);

    return res
      .status(200)
      .json({ message: "the post has been deleted", code: 200 });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.get("/:id", authMeddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await AppDataSource.getRepository(Post).findOneBy({
      id: Number(id),
    });
    return res.status(200).json({
      code: 200,
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.put("/:id/like", authMeddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await AppDataSource.manager.findOneBy(Post, {
      id: Number(id),
    });

    if (post?.likes.includes(String(req.user?._id))) {
      post.likes = post.likes.filter((id) => id !== String(req.user?._id));
      await AppDataSource.manager.save(post);
      return res
        .status(200)
        .json({ message: "The post has been disliked", code: 200 });
    }

    post?.likes.push(String(req.user?._id));
    await AppDataSource.manager.save(post);

    return res
      .status(200)
      .json({ message: "The post has been liked", code: 200 });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

router.get(
  "/timeline/all",
  authMeddleware,
  async (req: Request, res: Response) => {
    try {
      const currentUser = await AppDataSource.manager.findOneBy(User, {
        id: req.user?._id,
      });

      const currentUserPosts = await AppDataSource.getRepository(Post).findBy({
        userId: req.user?._id,
      });

      console.log(currentUserPosts);

      const friendPosts = await Promise.all(
        currentUser?.followings.map((friendId) => {
          const friend = AppDataSource.getRepository(Post).findBy({
            userId: Number(friendId),
          });

          return friend;
        }) || []
      );

      return res.status(200).json({
        message: "timeline",
        posts: currentUserPosts.concat(...friendPosts),
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        error: "На сервере произошла ошибка попробуйте позже.",
      });
    }
  }
);

router.get("/profile/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const allUserPosts = await AppDataSource.getRepository(Post).findBy({
      userId: Number(userId),
    });

    return res.status(200).json({ code: 200, posts: allUserPosts.reverse() });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: "На сервере произошла ошибка попробуйте позже.",
    });
  }
});

export = router;
