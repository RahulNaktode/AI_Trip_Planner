import { GoogleGenAI } from "@google/genai";
import Trip from "../models/Trip.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateTrip = async (req, res) => {
  try {
    const { destination, inputs = {} } = req.body;

    // Validate destination
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required",
      });
    }

    // Get logged-in user ID
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const duration = parseInt(inputs.duration) || 3;
    const travelers = parseInt(inputs.numTravelers) || 1;

    const prompt = `
You are a travel expert.

Create a travel itinerary for ${destination}
for ${duration} days for ${travelers} travelers.

Respond ONLY in valid JSON.

Use exactly this structure:

{
  "itinerary": {
    "days": [
      {
        "day": 1,
        "theme": "Theme Title",
        "neighborhood": "Area Name",
        "estimatedDailyCost": 150,
        "morning": {
          "activity": "Activity",
          "description": "...",
          "location": "...",
          "estimatedCost": 20,
          "tips": "..."
        },
        "afternoon": {
          "activity": "Activity",
          "description": "...",
          "location": "...",
          "estimatedCost": 50,
          "tips": "..."
        },
        "evening": {
          "activity": "Activity",
          "description": "...",
          "location": "...",
          "estimatedCost": 80,
          "tips": "..."
        }
      }
    ]
  },
  "insights": [
    {
      "title": "Local Secret",
      "content": "..."
    }
  ],
  "packingList": {
    "essentials": ["Passport"],
    "clothing": ["Jackets"],
    "gear": ["Camera"],
    "documents": ["Insurance"]
  }
}

Generate exactly ${duration} days.
`;

    // ==========================================
    // Gemini API with retry
    // ==========================================

    const models = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

    let interaction;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Gemini attempt ${attempt}/2`);

        interaction = await genai.interactions.create({
          model: "gemini-3.6-flash",
          input: prompt,
        });

        // Success
        break;

      } catch (error) {
        const status = error.status || error.statusCode;

        console.error(
          `Gemini attempt ${attempt} failed with status:`,
          status
        );

        // Retry only for 503
        if (status === 503 && attempt < 2) {
          console.log(
            "Gemini is currently busy. Retrying after 30 seconds..."
          );

          await new Promise((resolve) => {
            setTimeout(resolve, 30000);
          });

          continue;
        }

        throw error;
      }
    }

    // ==========================================
    // Check Gemini response
    // ==========================================

    if (!interaction?.output_text) {
      throw new Error("Gemini returned an empty response");
    }

    console.log("Gemini response:", interaction.output_text);

    let aiData;

    try {
      aiData = JSON.parse(interaction.output_text);
    } catch (error) {
      console.error("Invalid Gemini JSON:", interaction.output_text);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    // ==========================================
    // Save Trip in MongoDB
    // ==========================================

    const newTrip = new Trip({
      userId,

      destination,

      input: {
        ...inputs,
        duration,
        numTravelers: travelers,
      },

      itinerary: aiData.itinerary,

      insights: aiData.insights,

      packingList: aiData.packingList,

      shareId: uuidv4(),
    });

    await newTrip.save();

    console.log("Trip saved successfully:", newTrip._id);

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Trip generated and saved successfully",
      data: newTrip,
    });

  } catch (error) {
    console.error("Trip Generation Error:", error);

    const status = error.status || error.statusCode;

    // Gemini service temporarily unavailable
    if (status === 503) {
      return res.status(503).json({
        success: false,
        message: "Gemini service is temporarily busy.",
        error: "Please try again after some time.",
      });
    }

    // Other errors
    return res.status(500).json({
      success: false,
      message: "Failed to generate trip",
      error: error.message,
    });
  }
};

const getHistory = async (req, res) => {
    try {
        const trips =  await Trip.find({
            userId: new mongoose.Types.ObjectId(req.user.userId)
        });

        return res.json({trips: trips});
    } catch(error) {
        console.error("Error fetching trip history:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch trip history",
        });
    }
}

const getTripById = async (req, res) => {}

export { generateTrip, getHistory, getTripById };