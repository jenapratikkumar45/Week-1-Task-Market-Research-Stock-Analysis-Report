import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini Client to avoid crash if API key is missing during startup
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Deep Research endpoint using gemini-3.5-flash
app.post("/api/research", async (req, res) => {
  try {
    const { companies, customPrompt } = req.body;

    if (!companies || !Array.isArray(companies) || companies.length < 3) {
      return res.status(400).json({
        error: "Please select at least three companies from different sectors to generate the report.",
      });
    }

    const ai = getGeminiClient();

    // Construct detailed instructions for stock market analysis
    const companyListStr = companies
      .map((c, idx) => `${idx + 1}. ${c.name} (${c.ticker}) in Sector: ${c.sector}`)
      .join("\n");

    const promptText = `
You are an expert Senior Financial Analyst and Equity Research Director.
Conduct a highly comprehensive, professional-grade market research and stock analysis report focusing on the following 3 selected companies:
${companyListStr}

${customPrompt ? `The user has specified these custom focus areas/instructions:\n"${customPrompt}"\n` : ""}

Produce a detailed report structure with exact metrics and rich prose. Since your report must show depth of analysis and support 30 to 35 hours of expected research quality, ensure the prose is expert, formal, and authoritative.

You must return your response in structured JSON matching the requested schema. Provide realistic 12-month historical stock price data points (representing monthly closes from July 2025 to July 2026) for each of the selected companies so we can render performance charts.

Ensure that:
1. "peRatio" is a realistic number (positive float or integer).
2. "earnings" details recent quarterly/annual results, and "revenueGrowth" includes a percentage growth rate.
3. "historicalData" has exactly 12 items, each with a "date" (e.g. "Aug 2025", "Sep 2025", ...) and a realistic "price" (number). Make sure the pricing trend reflects realistic growth/volatility of the selected stock.
4. "references" are highly professional, complete sources with dummy or actual financial research URLs.
5. Provide actionable, critical investment hypotheses and future tracking metrics.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are a professional financial analyst. Provide fully detailed, comprehensive, high-quality, and objective equity research in flawless English. Do not use generic explanations; provide specific metrics, revenue drivers, margins, competitive advantages (moats), risks, and macroeconomic factors.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["marketOverview", "companiesAnalysis", "conclusiveInsights", "references"],
          properties: {
            marketOverview: {
              type: Type.OBJECT,
              required: ["economicContext", "majorDrivers", "risks"],
              properties: {
                economicContext: {
                  type: Type.STRING,
                  description: "Comprehensive review of the overall economic context, inflation, interest rates, and stock market sentiment."
                },
                majorDrivers: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of major structural drivers in the current market environment."
                },
                risks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Key systematic or macroeconomic risks threatening the equity markets."
                }
              }
            },
            companiesAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: [
                  "ticker",
                  "name",
                  "sector",
                  "profile",
                  "earnings",
                  "peRatio",
                  "revenueGrowth",
                  "stockPerformance",
                  "competitivePositioning",
                  "potentialGrowth",
                  "historicalData"
                ],
                properties: {
                  ticker: { type: Type.STRING },
                  name: { type: Type.STRING },
                  sector: { type: Type.STRING },
                  profile: { type: Type.STRING, description: "Detailed summary of the company business model and sector." },
                  earnings: { type: Type.STRING, description: "Detailed review of recent earnings, margins, net income, or EPS." },
                  peRatio: { type: Type.NUMBER, description: "The trailing price-to-earnings ratio." },
                  revenueGrowth: { type: Type.STRING, description: "Recent year-over-year revenue growth rate or metrics (e.g. +14% YoY)." },
                  stockPerformance: { type: Type.STRING, description: "Summary of stock performance, price range, and trading trends." },
                  competitivePositioning: { type: Type.STRING, description: "Analytical review of the company's competitive advantages, barriers to entry, and key competitors." },
                  potentialGrowth: { type: Type.STRING, description: "Key catalysts, product lines, or expansion plans for future growth." },
                  historicalData: {
                    type: Type.ARRAY,
                    description: "Exactly 12 monthly data points for a stock price performance chart.",
                    items: {
                      type: Type.OBJECT,
                      required: ["date", "price"],
                      properties: {
                        date: { type: Type.STRING, description: "Format: 'MMM YYYY', e.g. 'Aug 2025'" },
                        price: { type: Type.NUMBER, description: "Stock closing price in USD." }
                      }
                    }
                  }
                }
              }
            },
            conclusiveInsights: {
              type: Type.OBJECT,
              required: ["summary", "aiInsightSummary", "recommendations", "investmentHypotheses"],
              properties: {
                summary: { type: Type.STRING, description: "Authoritative synthesis of the entire report's findings." },
                aiInsightSummary: { type: Type.STRING, description: "A concise 1-2 sentence high-level AI insight or takeaway summarizing the core conclusion." },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of detailed, concrete tracking recommendations or watchlists."
                },
                investmentHypotheses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of well-argued, testable hypotheses for future tracking or investment."
                }
              }
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["source", "url", "description"],
                properties: {
                  source: { type: Type.STRING, description: "e.g. 'SEC Edgar System' or 'Bloomberg Terminal'" },
                  url: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Brief description of how the resource was utilized." }
                }
              }
            },
            footerNotes: {
              type: Type.STRING,
              description: "Brief disclaimer or footer note for the report."
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response received from Gemini API.");
    }

    const reportData = JSON.parse(response.text.trim());
    return res.json(reportData);

  } catch (error: any) {
    console.error("Gemini API server-side call failed:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while running market research. Please verify your GEMINI_API_KEY setup.",
    });
  }
});

// Setup dev server or serve production build
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
