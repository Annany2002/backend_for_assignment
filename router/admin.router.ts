import { Router } from "express";
import { authenticateToken } from "../utils/auth";
import {
  createItem,
  deleteItem,
  updateItem,
} from "../controllers/admin.controller";
import { getAllClients } from "../controllers/admin.controller";

export const adminRouter = Router();

adminRouter.get("/get-clients", authenticateToken, getAllClients);
adminRouter.post("/items/create", authenticateToken, createItem);
adminRouter.patch("/items/update/:itemId", authenticateToken, updateItem);
adminRouter.delete("/items/delete/:itemId", authenticateToken, deleteItem);
