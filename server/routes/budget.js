import express from "express";
import { calculateBudget, getHistory, getAIInsight } from "../controllers/budgetController.js";
import { body, validationResult } from "express-validator";
import rateLimiter from "express-rate-limit";
import { checkJWT } from "../middleware/jwt.js";

const router = express.Router();

const aiLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15, 
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

const calValidation = [
    body("destination").notEmpty().withMessage("Destination is required").trim(),
    body("inputs.duration").isInt({ min: 1 }).withMessage("Duration must be at least 1 day"),
    body("inputs.numTravelers").optional().isInt({ min: 1 }),
    body("inputs.userCurrency").optional().isString().isLength({ min: 3, max: 3 }).withMessage("Currency must be a 3-letter code (e.g., USD, EUR)"),
    body("inputs.accommodationType").notEmpty().withMessage("Accommodation type is required"),
]

const aiValidation = [
    body("budgetId").isMongoId().withMessage("A valid Budget ID is required")
]

router.post("/calculate",checkJWT, calValidation, validate, calculateBudget);

router.get("/history", checkJWT, getHistory);

router.post("/ai-insights", checkJWT, aiLimiter, aiValidation, validate, getAIInsight);

export default router;