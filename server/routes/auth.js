import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import {checkJWT} from "../middleware/jwt.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", checkJWT, getMe);


export default router;