import express from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";
import {checkJWT} from "../middleware/jwt.js";
import { body, validationResult } from "express-validator";

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

const registerValidation = [
    body("name").trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters long"),
    body("email").isEmail()
    .withMessage("Please provide the valid email message")
    .normalizeEmail(),
    body("password").isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
    body("country").notEmpty().withMessage("Country is required")
];

const loginValidation = [
    body("email").isEmail()
    .withMessage("Please provide the valid email message")
    .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
];

const router = express.Router();

router.post("/register", validate, registerValidation, register);
router.post("/login", validate, loginValidation, login);
router.get("/me", checkJWT, getMe);
router.post("/logout", logout);


export default router;