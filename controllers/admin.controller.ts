import { Request, Response } from "express";
import { ItemModel, UserModel } from "../models/model";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export async function getAllClients(req: Request, res: Response) {
  try {
    const { userId } = req.user;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admins" });
    }

    const clients = await UserModel.find({ role: "client" });
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: "No clients found" });
    }

    res.status(200).json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function createItem(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const { name, description } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Can only be changed by admin" });
    }

    const dbItem = await ItemModel.findOne({ name });
    if (dbItem) {
      return res.status(409).json({ message: "Item already exists" });
    }

    const newItem = new ItemModel({ name, description, owner: user._id });
    await newItem.save();

    user.items.push(newItem._id);
    await user.save();

    res.status(201).json({ newItem });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function updateItem(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const { name, description } = req.body;
    const { itemId } = req.params;

    const dbUser = await UserModel.findOne({ _id: userId });
    if (!dbUser) {
      return res.status(404).json({ message: "User Not found" });
    }

    if (!dbUser.items.toString().includes(itemId)) {
      return res.status(403).json({ message: "Unauthorized admin" });
    }

    const itemToBeUpdated = await ItemModel.findOne({ _id: itemId });
    if (!itemToBeUpdated) {
      return res.status(404).json({ message: "Item not found" });
    }

    itemToBeUpdated.name = name;
    itemToBeUpdated.description = description;

    await itemToBeUpdated.save();

    return res.status(200).json(itemToBeUpdated);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function deleteItem(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const { itemId } = req.params;

    const dbUser = await UserModel.findOne({ _id: userId });
    if (!dbUser) {
      return res.status(404).json({ message: "User Not found" });
    }

    if (!dbUser.items.toString().includes(itemId)) {
      return res.status(403).json({ message: "Unauthorized admin" });
    }

    const itemToBeDeleted = await ItemModel.findOneAndDelete({ _id: itemId });
    if (!itemToBeDeleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
