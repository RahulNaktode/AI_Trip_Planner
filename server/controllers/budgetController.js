import { GoogleGenAI } from "@google/genai";
import axios from "axios";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const COST_MULTIPLIERS = {
    accommodation: {
        hostel: 35,
        "budget-hotel": 85,
        "mid-range": 160,
        boutique: 240,
        luxury: 450,
        airbnb: 130,
    },
    food: {
        "street-food": 28,
        casual: 50,
        mix: 80,
        restaurant: 120,
        "fine-dining": 250,
    },
};

const SEASON_FACTORS = { peak: 1.3, shoulder: 1.0, "off-peak": 0.75 };

const calculateBudget = async (req, res) => {
    try {
        const { destination, inputs = {} } = req.body;

        if(!destination) {
            return res.status(400).json({
                error: "Destination is required"
            });
        }

        const duration = Math.max(1, parseInt(inputs.duration) || 1);
        const numTravelers = Math.max(1, parseInt(inputs.numTravelers) || 1);
        const accommodationType = inputs.accommodationType || "mid-range";
        const dailyFoodPreference = inputs.dailyFoodPreference || 'mix';
        const travelSeason = inputs.travelSession || "shoulder";
        const userCurrency = (inputs.userCurrency || "USD").toUpperCase();

        let exchangeRate = 1;
        try{
            const rateRes = await axios.get(`https://open.er-api.com/v6/latest/USD`,{
                timeout: 4000
            });

            exchangeRate = rateRes.data.rates[userCurrency] || 1;
        }catch(err){
            console.warn("Currency conversion failed, defaulting to USD");
        }

        const seasonMult = SEASON_FACTORS[travelSeason] || 1;
        const baseAccommodation = (COST_MULTIPLIERS.accommodation[accommodationType] || 160) * seasonMult;

        const baseFood = (COST_MULTIPLIERS.food(dailyFoodPreference) || 80) * seasonMult;

        const breakdown = {
            accommodation: Math.round(baseAccommodation * duration * exchangeRate),
            food: Math.round(baseFood * numTravelers * exchangeRate),
            transport: Math.round(25 * duration * numTravelers * exchangeRate),
            insurance: Math.round(10 * duration * numTravelers * exchangeRate),
        };

        const subtotal = Object.values(breakdown).reduce((a, b) => a + b, 0);
        const miscellaneous = Math.round(subtotal * 0.1);
        const emergencyBuffer = Math.round((subtotal + miscellaneous) * 0.15);
        const total = subtotal + miscellaneous + emergencyBuffer;

    }catch (error) {
        console.error("Error calculating budget:", error);
        res.status(500).json({
            error: "Budget calculation failed", detils: error.message
        });
    }
}

export { calculateBudget };