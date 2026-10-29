import express from "express"
import { getHealth, getHome } from "../controllers/healthController.js";

const router = express.Router();

router.post("/home", getHome);
router.post("/health", getHealth);

export default router;