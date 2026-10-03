import { Schema, model } from "mongoose";

const budgetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    destination: {
        type: String,
        required: [true, "Destination is required"],
        trim: true,
    },

    destinationImage: {
        type: String,
        default: "https://unsplash.com/photos/woman-in-white-fur-coat-He4JVMx2Jfg",
    },

    currency: {
        type: String,
        uppercase: true,
        default: "USD",
    },

    inputs: {
        duration: {type:Number, required: true, min: 1},
        numTravelers: {type:Number, default: 1, min: 1},
        accommodationType: {type:String, lowercase: true, trim: true},
        travelSession: {type:String, lowercase: true, trim: true},
        ddailyFoodPreference: {type:String, lowercase: true, trim: true},
        userCurrency: {type:String, uppercase: true, default: "USD"},
    },

    breakdown: {
        accommodation: {type:Number, default: 0},
        food: {type:Number, default: 0},
        flight: {type:Number, default: 0},
        transport: {type:Number, default: 0},
        insurance: {type:Number, default: 0},
        miscellaneous: {type:Number, default: 0},
        emergency: {type:Number, default: 0},
        total: {type:Number, default: 0},
        prePerson: {type:Number, default: 0},
    },

    aiInsights: {
        verdict: String,
        moneySavingTips: [String],
        hiddenCosts: [String],
        localPriceExample: Schema.Types.Mixed,
    },

    status: {
        type: String,
        enum: ["active", "archived"],
        default: "active",
    },

    },{
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    });

    const Budget = model("Budget", budgetSchema);

    export default Budget;