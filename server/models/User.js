import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false, 
    },
    currency: {
        type: String,
        default: "USD",
        uppercase: true,
    },
    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
    }
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.pre("save", async function() {
    if(this.isModified("password")) {
        try{
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }catch(error){
            console.log("Password hashing error: ", error);
        }
    }

    if(this.isModified("country")) {
        const countryCurrencyMap = {
            "USA": "USD",
            "Canada": "CAD",
            "UK": "GBP",
            "Germany": "EUR",
            "France": "EUR",
            "Japan": "JPY",
        };
        this.currency = countryCurrencyMap[this.country.toUpperCase() || "USD"];
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); 
};

const User = model("User", userSchema);

export default User;