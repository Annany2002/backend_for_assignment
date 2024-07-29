import { Router } from "express";
import {
  getAllItems,
  registerUser,
  loginUser,
  commentOnItem,
  likeItem,
} from "../controllers/user.controller";
import { authenticateToken } from "../utils/auth";
import { adminRouter } from "./admin.router";

export const userRouter = Router();

userRouter.use("/admin", adminRouter);

userRouter.get("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/items", authenticateToken, getAllItems);
userRouter.post("/items/:itemId/comment", authenticateToken, commentOnItem);
userRouter.post("/items/:itemId/rating", authenticateToken, likeItem);
