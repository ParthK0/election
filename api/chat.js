import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // CORS origin check
  const allowedOrigins = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:5173',
    'http://localhost:4173'
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (typeof prompt !== 'string' || prompt.length > 2000) {
    return res.status(400).json({ error: 'Prompt must be a string under 2000 characters' });
  }

  if (!context || typeof context !== 'object') {
    return res.status(400).json({ error: 'Context object is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
You are an election education assistant. Your role is to explain 
electoral processes, timelines, voter rights, and civic procedures 
in a clear, neutral, and factual way.

Current context:
- Country: ${context.country || 'Global'}
- Current Phase the user is viewing: ${context.currentPhase || 'Overview'}
- User role: ${context.role || 'Voter'}

Rules:
1. Never express political opinions or preference for any party/candidate.
2. Cite official sources when possible (Election Commission, government sites).
3. Use simple language — assume no prior civics knowledge.
4. If asked about a specific country you don't have data on, say so clearly.
5. Always encourage civic participation.
6. If the user asks a question unrelated to elections, politely guide them back to election education.
7. Keep responses concise but informative.
`;

    // Build multi-turn conversation contents
    const contents = [{ role: 'user', parts: [{ text: systemPrompt }] }, { role: 'model', parts: [{ text: 'Understood. I am your election education assistant. I will provide neutral, factual information about electoral processes. How can I help you today?' }] }];

    // Add conversation history (last 5 exchanges for context)
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-10); // last 5 exchanges = 10 messages
      for (const msg of recentHistory) {
        if (msg.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: msg.content }] });
        } else if (msg.role === 'bot') {
          contents.push({ role: 'model', parts: [{ text: msg.content }] });
        }
      }
    }

    // Add the current prompt
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const result = await model.generateContent({ contents });
    
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
}
