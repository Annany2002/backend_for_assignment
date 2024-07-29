import express from "express";
import cors from "cors";
import { config } from "dotenv";

import { userRouter } from "./router/user.route";
import { dbConnect } from "./lib/connect";

const app = express();
const PORT = 5000;
config();

app.use(cors());
app.use(express.json());

dbConnect();

app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
