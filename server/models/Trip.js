import { Schema, model } from "mongoose";

const tripSchema = new Schema({
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

    input: {
        startDate: String,
        endDate: String,
        duration: { type: Number, default: 3 },
        numTravelers: { type: Number, default: 1 },
        travelStyle: { type: String, default: "standard" },
        interest: String,
        budgetMin: Number,
        budgetMax: Number,
    },

    itinerary: {
        type: Schema.Types.Mixed,
        required: true,
    },

    shareId: {
        type: String,
        unique: true,
        sparse: true,
    },

    isPublic: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const Trip = model("Trip", tripSchema);

export default Trip;