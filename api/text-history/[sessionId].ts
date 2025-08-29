import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { sessionId } = req.query;
    
    // For Vercel deployment with serverless functions, 
    // we'll return empty history for now since memory storage doesn't persist
    // In production, you would connect to a database here
    res.json([]);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Failed to retrieve history' });
  }
}