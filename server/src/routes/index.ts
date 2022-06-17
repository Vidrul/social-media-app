import express from "express";
const router = express.Router({ mergeParams: true });
import auth from "./auth.routes";
import user from "./user.routes";
import post from "./post.routes";
import conversation from "./conversation.routes";
import messages from "./messages.routes";

router.use("/auth", auth);
router.use("/user", user);
router.use("/post", post);
router.use("/conversation", conversation);
router.use("/message", messages);

export default router;
