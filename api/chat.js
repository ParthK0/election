import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
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

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: prompt }
    ]);
    
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
}
