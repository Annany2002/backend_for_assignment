import { connect } from "mongoose";

export async function dbConnect() {
  try {
    await connect(process.env.MONGO_URL as string);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
}
