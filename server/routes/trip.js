import express from "express";
import { generateTrip, getHistory, getTripById, toggelShare, deleteTrip, getShareTrip } from "../controllers/tripController.js";
import { checkJWT } from "../middleware/jwt.js";
import { body, validationResult } from "express-validator";
import rateLimiter from "express-rate-limit";

const router = express.Router();

const aiLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, 
    message: {
        message: "AI generate quote reached, please try again after an hour",
        standardHeaders: true,
        legacyHeaders: false,
    }
});

const validate = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.json({
            status: "error",
            errors: error.array()
        });
    }
    next();
}

const generateValidator = [
    body("destination").notEmpty().withMessage("Destination is required").trim(),
    body("inputs.numTravelers").isInt({ min: 1 }).withMessage("Must have at least 1 traveler"),
    body("inputs.travelStyle").notEmpty().withMessage("Travel style is required"),
    body("inputs.interest").isArray({ min: 1 }).withMessage("At least one interest is required"),
]

router.post("/generate", checkJWT, aiLimiter, generateValidator, validate, generateTrip);

router.get("/history", checkJWT, getHistory);
router.get("/:id", checkJWT, getTripById);
router.patch("/:id/share", checkJWT, toggelShare);
router.delete("/:id", checkJWT, deleteTrip);
router.get("/share/:shareId", getShareTrip);

export default router;