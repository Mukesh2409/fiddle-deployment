import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { toneAdjustmentRequestSchema, insertTextHistorySchema } from "@shared/schema";
import { randomUUID } from "crypto";

// Simple cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function callMistralAPI(text: string, toneType: string): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY || process.env.VITE_MISTRAL_API_KEY || "default_key";
  
  const tonePrompts = {
    "formal-professional": "Rewrite this text in a formal, professional tone suitable for business communications:",
    "casual-friendly": "Rewrite this text in a casual, friendly tone that's approachable and conversational:",
    "technical-precise": "Rewrite this text in a technical, precise tone with detailed explanations:",
    "creative-engaging": "Rewrite this text in a creative, engaging tone that's vivid and compelling:"
  };

  const prompt = `${tonePrompts[toneType as keyof typeof tonePrompts]} "${text}"`;
  
  // Create cache key
  const cacheKey = `${toneType}-${Buffer.from(text).toString('base64').slice(0, 50)}`;
  
  // Check cache first
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const modifiedText = data.choices?.[0]?.message?.content?.trim();
    
    if (!modifiedText) {
      throw new Error('No response from Mistral AI');
    }

    // Cache the response
    responseCache.set(cacheKey, { data: modifiedText, timestamp: Date.now() });
    
    return modifiedText;
  } catch (error) {
    console.error('Mistral API call failed:', error);
    throw new Error(`Failed to process tone adjustment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Tone adjustment endpoint
  app.post("/api/tone-adjustment", async (req, res) => {
    try {
      const validatedData = toneAdjustmentRequestSchema.parse(req.body);
      const { text, toneType, sessionId = randomUUID() } = validatedData;

      // Call Mistral AI
      const modifiedText = await callMistralAPI(text, toneType);

      // Store in history
      const historyEntry = await storage.createTextHistoryEntry({
        sessionId,
        originalText: text,
        modifiedText,
        toneType,
        metadata: { userAgent: req.get('User-Agent') }
      });

      res.json({
        originalText: text,
        modifiedText,
        toneType,
        sessionId,
        historyId: historyEntry.id,
      });
    } catch (error) {
      console.error('Tone adjustment error:', error);
      if (error instanceof Error) {
        res.status(400).json({ 
          message: error.message.includes('Zod') ? 'Invalid request data' : error.message 
        });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  // Get text history for a session
  app.get("/api/text-history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const history = await storage.getTextHistory(sessionId);
      res.json(history);
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ message: 'Failed to retrieve history' });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      cacheSize: responseCache.size 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
