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

export { register };