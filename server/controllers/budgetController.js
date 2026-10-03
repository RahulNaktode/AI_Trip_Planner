import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import Budget from "../models/Budget.js";

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

        const baseFood = (COST_MULTIPLIERS.food[dailyFoodPreference] || 80) * seasonMult;

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

        const budget = new Budget({
            userId: req.user.userId || req.user._id,
            destination,
            currency: userCurrency,
            inputs: { ...inputs, duration, numTravelers, userCurrency },
            breakdown: { ...breakdown, miscellaneous, emergencyBuffer, total },
        });

        await budget.save();

        res.json({ budget, exchangeRateUsed: exchangeRate });

    }catch (error) {
        console.error("Error calculating budget:", error);
        res.status(500).json({
            error: "Budget calculation failed", detils: error.message
        });
    }
}

const getHistory = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.userId || req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
        res.json({ budgets: budgets || [] });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve budget history"});
    }
}

const getAIInsight = async (req, res) => {
    try {
        const { budgetId } = req.body;

        if (!budgetId) {
            return res.status(400).json({
                error: "Budget Id required",
            });
        }

        const budget = await Budget.findOne({
            _id: budgetId,
            userId: req.user.userId || req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                error: "Budget Record not found.",
            });
        }

        const prompt = `
Analyze this travel budget.

Destination: ${budget.destination}
Total Budget: ${budget.breakdown.total} ${budget.currency}
Duration: ${budget.inputs.duration} days
Travelers: ${budget.inputs.numTravelers}

Give:
1. A verdict on whether the budget is realistic.
2. Exactly 3 money-saving tips.
3. Exactly 2 hidden costs.
4. Local price examples.

Return ONLY valid JSON.

Use exactly this structure:

{
    "verdict": "string",
    "moneySavingTips": [
        "string",
        "string",
        "string"
    ],
    "hiddenCosts": [
        "string",
        "string"
    ],
    "localPriceExample": "string"
}

Do not return Markdown.
Do not use code fences.
Do not add text outside the JSON.
`;

        console.log("Sending prompt to Gemini...");

        const interaction = await genai.interactions.create({
            model: "gemini-3.6-flash",

            system_instruction:
                "You are a senior travel financial consultant. Return valid JSON only.",

            input: prompt,

            response_format: {
                type: "text",
                mime_type: "application/json",
            },
        });

        console.log("Gemini response:", interaction.output_text);

        if (!interaction?.output_text) {
            return res.status(500).json({
                error: "Gemini returned an empty response",
            });
        }

        let aiRaw;

        try {
            aiRaw = JSON.parse(interaction.output_text);
        } catch (parseError) {
            console.error(
                "Invalid Gemini JSON:",
                interaction.output_text
            );

            return res.status(500).json({
                error: "Gemini returned invalid JSON",
                rawResponse: interaction.output_text,
            });
        }

        budget.aiInsights = {
            verdict: aiRaw.verdict,
            moneySavingTips: aiRaw.moneySavingTips,
            hiddenCosts: aiRaw.hiddenCosts,
            localPriceExample: aiRaw.localPriceExample,
        };

        await budget.save();

        return res.status(200).json({
            success: true,
            aiInsights: budget.aiInsights,
        });

    } catch (err) {
        console.error("AI Insight Error:", err);

        return res.status(500).json({
            success: false,
            error: "Failed to generate AI insight",
            message: err.message,
        });
    }
};

export { calculateBudget, getHistory, getAIInsight };