import OpenAI from "openai";
import Trip from "../models/Trip.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateTrip = async (req, res) => {
    const { destination, inputs = {} } = req.body;

    const duration = parseInt(inputs.duration) || 3;
    const travelers = parseInt(inputs.numTravelers) || 1;

    const prompt = `Create a travel itinerary for ${destination} for ${duration} days.
    Respond ONLY in valid JSON with the EXACT structure:
    {
      "itinerary": {
        "days":[
        {
            "day": 1,
            "theme": "Theme Title",
            "neighborhood": "Area Name",
            "estimatedDailyCost": 150,
            "morning": {"activity": "Activity", "description": "...", "location": "...", "estimatedCost": 20, "tips": "..."},
            "afternoon": {"activity": "Activity", "description": "...", "location": "...", "estimatedCost": 50, "tips": "..."},
            "evening": {"activity": "Activity", "description": "...", "location": "...", "estimatedCost": 80, "tips": "..."}
        }
        ]
    },
    "insights": [
       { "title": "Local Secret", "content": "..." }
    ],
    "packingList": {
        { "essentials": ["Passport"], "clothing": ["Jackets"], "gear": ["Camera"], "documents": ["Insurance"] }
    }`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a travel expert. Output JSON only." },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
    });

    const aiData = JSON.parse(completion.choices[0].message.content);
}

export { generateTrip };