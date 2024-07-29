import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [String],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "ClientModel",
  },
});

export const ItemModel = model("item", itemSchema);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  items: {
    type: [Schema.Types.ObjectId],
    ref: "ItemModel",
  },
});

export const UserModel = model("user", userSchema);
