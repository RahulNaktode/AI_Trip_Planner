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
        dailyFoodPreference: {type:String, lowercase: true, trim: true},
        userCurrency: {type:String, uppercase: true, default: "USD"},
    },

    breakdown: {
        accommodation: {type:Number, default: 0},
        food: {type:Number, default: 0},
        flight: {type:Number, default: 0},
        transport: {type:Number, default: 0},
        insurance: {type:Number, default: 0},
        miscellaneous: {type:Number, default: 0},
        emergencyBuffer: {type:Number, default: 0},
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

    budgetSchema.pre('save', function() {
        this.currency = this.inputs.userCurrency || "USD";

        const b = this.breakdown;

        const total = 
        (Number(b.accommodation) || 0) + 
        (Number(b.food) || 0) +
        (Number(b.flight) || 0) +
        (Number(b.transport) || 0) +
        (Number(b.insurance) || 0) +
        (Number(b.miscellaneous) || 0) +
        (Number(b.emergencyBuffer) || 0);

        this.breakdown.total = Math.round(total);

        const travelers = Math.max(1, this.inputs.numTravelers || 1);
        this.breakdown.prePerson = Math.round(total / travelers);
    });

    budgetSchema.virtual("formatedTotal").get(function() {
        try{
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: this.currency || "USD",
            }).format(this.breakdown.total);
        }catch(error){
            return `${this.currency} ${this.breakdown.total}`;
        }
    })

    budgetSchema.virtual("dailyBurnRate").get(function() {
        if(!this.inputs.duration || this.inputs.duration <= 0) return 0;
        return Math.round(this.breakdown.total / this.inputs.duration);
    })

    const Budget = model("Budget", budgetSchema);

    export default Budget;