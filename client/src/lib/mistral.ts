export const TONE_PROMPTS = {
  "formal-professional": "Rewrite this text in a formal, professional tone suitable for business communications:",
  "casual-friendly": "Rewrite this text in a casual, friendly tone that's approachable and conversational:",
  "technical-precise": "Rewrite this text in a technical, precise tone with detailed explanations:",
  "creative-engaging": "Rewrite this text in a creative, engaging tone that's vivid and compelling:"
} as const;

export type ToneType = keyof typeof TONE_PROMPTS;

export const TONE_DISPLAY_NAMES = {
  "formal-professional": "Formal Professional",
  "casual-friendly": "Casual Friendly", 
  "technical-precise": "Technical Precise",
  "creative-engaging": "Creative Engaging"
} as const;
