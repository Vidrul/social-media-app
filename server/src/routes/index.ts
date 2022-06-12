import express from "express";
const router = express.Router({ mergeParams: true });
import auth from "./auth.routes";
import user from "./user.routes";
import post from "./post.routes";

router.use("/auth", auth);
router.use("/user", user);
router.use("/post", post);
post
export default router;
