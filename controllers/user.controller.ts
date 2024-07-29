import { Request, Response } from "express";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { ItemModel, UserModel } from "../models/model";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, password, role } = req.body;

    const dbUser = await UserModel.findOne({ username, role });
    if (dbUser) {
      return res
        .status(409)
        .json({ message: "User already exist with the specific role" });
    }
    const newUser = new UserModel({
      username,
      password: hashSync(password, genSaltSync(12)),
      role,
    });

    const savedUser = await newUser.save();

    const token = sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      username: savedUser.username,
      userId: savedUser._id,
      role: savedUser.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { username, password, role } = req.body;

    const dbUser = await UserModel.findOne({ username, role });
    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "User not found, kindly register" });
    }

    if (!compareSync(password, dbUser.password)) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const userId = dbUser._id;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      const token = sign({ userId }, process.env.JWT_SECRET!);
      return res.status(200).json({ username, role, userId, token });
    }

    return res.status(200).json({ username, userId, role });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function getAllItems(req: Request, res: Response) {
  try {
    const { userId } = req.user;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const items = await ItemModel.find({});
    if (items.length === 0 || !items) {
      return res.status(404).json({ items, message: "No items found" });
    }

    return res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function commentOnItem(req: Request, res: Response) {
  try {
    const { comment } = req.body;
    const { userId } = req.user;
    const { itemId } = req.params;

    const dbUser = await UserModel.findById(userId);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = await ItemModel.findOne({ _id: itemId });
    if (!item) {
      return res.status(404).json({ message: "Item does not exist" });
    }
    item.comments.push(comment);
    await item.save();

    return res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function likeItem(req: Request, res: Response) {
  try {
    const { rating } = req.body;
    const { userId } = req.user;
    const { itemId } = req.params;

    const dbUser = await UserModel.findById(userId);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = await ItemModel.findOne({ _id: itemId });
    if (!item) {
      return res.status(404).json({ message: "Item does not exist" });
    }

    item.rating = rating;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
