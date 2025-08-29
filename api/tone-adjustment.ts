import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from "crypto";
import { z } from "zod";

// Define the schema inline for Vercel compatibility
const toneAdjustmentRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  toneType: z.enum(["formal-professional", "casual-friendly", "technical-precise", "creative-engaging"]),
  sessionId: z.string().optional(),
});

// Simple cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function callMistralAPI(text: string, toneType: string): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY || process.env.VITE_MISTRAL_API_KEY;
  
  if (!apiKey || apiKey === "default_key") {
    throw new Error("MISTRAL_API_KEY environment variable is not set");
  }
  
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Log the request for debugging
    console.log('Request body:', req.body);
    console.log('Environment check - MISTRAL_API_KEY exists:', !!process.env.MISTRAL_API_KEY);

    const validatedData = toneAdjustmentRequestSchema.parse(req.body);
    const { text, toneType, sessionId = randomUUID() } = validatedData;

    // Call Mistral AI
    const modifiedText = await callMistralAPI(text, toneType);

    // For Vercel deployment, we'll store in memory for now
    // In production, you might want to use a database
    const historyId = randomUUID();

    res.json({
      originalText: text,
      modifiedText,
      toneType,
      sessionId,
      historyId,
    });
  } catch (error) {
    console.error('Tone adjustment error:', error);
    if (error instanceof Error) {
      const isValidationError = error.message.includes('ZodError') || error.message.includes('validation');
      res.status(isValidationError ? 400 : 500).json({ 
        message: isValidationError ? 'Invalid request data' : error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
