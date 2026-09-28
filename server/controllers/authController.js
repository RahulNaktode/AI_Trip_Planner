import { validationResult } from "express-validator";
import User from "../models/User.js";
import JWT from "jsonwebtoken";

const signToken = (id) => {
    return JWT.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
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
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return res.json({ errors: error.array() });
    }

    try{
        const { name, email, password, country } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.json({ message: "This email is already registered" });
        }

        const user = await User.create({ name, email, password, country });

        const token = signToken(user._id);

        return res.json({ 
            message: "User registered successfully", 
            token: token,
            data: filterUserResponse(user)
        });

        console.log(req.body);
    } catch(error){
        console.log("Registeration error: ", error);
    }
}

const login = async (req, res) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return res.json({ errors: error.array() });
    }

    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if(!user || !(await user.comparePassword(password))) {
            return res.json({ message: "Invalid email or password" });
        }

        const token = signToken(user._id);

        return res.json({
            success: true,
            token: token,
            data: filterUserResponse(user)
        })

    }catch(error){
        console.log("Login error: ", error);
        return res.json({
            error: "Login failed, please try again later"
        })
    }
}

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