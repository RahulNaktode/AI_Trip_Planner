import { validationResult } from "express-validator";
import User from "../models/User.js";
import JWT from "jsonwebtoken";

const signToken = (id) => {
    return JWT.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "3d",
    });
}

const filterUserResponse = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    country: user.country,
    currency: user.currency,
    plan: user.plan || "free",
})


const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, country } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            country,
        });

        const token = signToken(user._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: filterUserResponse(user),
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed",
        });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = signToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: filterUserResponse(user),
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed, please try again later",
        });
    }
};


const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId);

        if(!user) {
            return res.json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        return res.json({
            success: true,
            data: filterUserResponse(user)
        });

    }catch(error){
        console.log("GetMe error: ", error);
        return res.json({
            success: false,
            message: "Failed to fetch user data.",
            data: null
        });
    }
}

const logout = (req, res) => {
    res.json({
        message: "Successfully logged out",
    })
}

export { register, login, getMe, logout };