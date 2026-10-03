import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectDB from "./db.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import tripRoute from "./routes/trip.js";
import budgetRoute from "./routes/budget.js";

dotenv.config();

const app = express();
app.use(morgan("dev"));

app.set("trust-proxy", 1);

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cookieParser());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }))

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many request, please try again later."}
})

const PORT = process.env.PORT || 5080;

app.use("/api/auth", generateLimiter, authRoutes);
app.use("/api/trip", generateLimiter, tripRoute);
app.use("/api/budget", generateLimiter, budgetRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.err(`[${new Date().toLocaleString()}] Error`, err.stack);

  if(err.status == 401 || (err.response && err.response.status == 401)){
    return res.status(500).json({ error: "AI Serverice configuration error, check api key..."});
  }

  res.status(statusCode).json({
    status: "Error",
    message: statusCode === 500 && process.env.NODE_ENV === "production"
    ? "Internal Server Error"
    : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack}),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});