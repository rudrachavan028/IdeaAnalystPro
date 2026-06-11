import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini
// We use lazy initialization to prevent crashing on startup if the key is missing
let ai: GoogleGenAI | null = null;
function getGenAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

// API Routes
app.post("/api/analyze", async (req, res) => {
  try {
    const aiClient = getGenAI();
    const { ideaName, description, problem, targetAudience, features } = req.body;

    if (!ideaName || !description || !problem) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `Act as a highly experienced startup analyst, venture capitalist, and market research expert.

Analyze the following startup idea in a deeply structured and professional manner.

Startup Idea Details:
- Idea Name: ${ideaName}
- Description: ${description}
- Problem Statement: ${problem}
- Target Audience: ${targetAudience || 'Not specified'}
- Key Features: ${features || 'Not specified'}

Provide a comprehensive, highly analytical, and realistic evaluation. Be concise but specific to this idea. Avoid generic advice.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemValidation: { type: Type.STRING, description: "Evaluate if the problem is real, urgent, and worth solving. Identify who faces this problem and how frequently." },
            solutionEffectiveness: { type: Type.STRING, description: "Analyze how well the solution solves the problem. Mention strengths and limitations." },
            existingProducts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List existing startups or products solving similar problems" },
            marketSize: {
              type: Type.OBJECT,
              properties: {
                tam: { type: Type.STRING, description: "Total Addressable Market (e.g., $10B)" },
                sam: { type: Type.STRING, description: "Serviceable Available Market (e.g., $2B)" },
                som: { type: Type.STRING, description: "Serviceable Obtainable Market (e.g., $50M)" },
                growthTrends: { type: Type.STRING, description: "Include growth trends and market potential" }
              }
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  details: { type: Type.STRING, description: "Compare features, pricing, and positioning" }
                }
              }
            },
            uvp: { type: Type.STRING, description: "Identify what makes this idea unique and explain why users would choose this" },
            targetAudience: { type: Type.STRING, description: "Define ideal users, including demographics and behavior" },
            personas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  profile: { type: Type.STRING, description: "Realistic user persona description" }
                }
              }
            },
            revenueModel: { type: Type.STRING, description: "Suggest best monetization strategy and justify why it fits" },
            costStructure: { type: Type.STRING, description: "Estimate development, marketing, and operational costs" },
            scalability: { type: Type.STRING, description: "Evaluate if the startup can scale and mention expansion opportunities" },
            risks: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                market: { type: Type.ARRAY, items: { type: Type.STRING } },
                legal: { type: Type.ARRAY, items: { type: Type.STRING } },
                financial: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            legalCompliance: { type: Type.ARRAY, items: { type: Type.STRING } },
            goToMarket: { type: Type.STRING, description: "Suggest launch strategy, marketing channels and tactics" },
            distribution: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggest how product will reach users" },
            partnerships: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggest potential collaborations" },
            techFeasibility: { type: Type.STRING, description: "Suggest required tech stack and mention AI/ML usage if applicable" },
            unitEconomics: { type: Type.STRING, description: "Estimate cost per user and potential revenue per user" },
            futureRoadmap: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggest future features and expansion ideas" },
            startupScore: {
              type: Type.OBJECT,
              properties: {
                feasibility: { type: Type.NUMBER, description: "0-10 score" },
                innovation: { type: Type.NUMBER, description: "0-10 score" },
                profitability: { type: Type.NUMBER, description: "0-10 score" },
                risk: { type: Type.NUMBER, description: "0-10 score (10 means high risk)" },
                finalScore: { type: Type.NUMBER, description: "Out of 100" },
                reasoning: { type: Type.STRING, description: "Provide reasoning for each score" }
              }
            },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Give actionable recommendations to improve the idea" }
          }
        }
      }
    });

    if (response.text) {
      res.json(JSON.parse(response.text));
    } else {
      res.status(500).json({ error: "Failed to generate analysis content." });
    }
  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
