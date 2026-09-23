import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});