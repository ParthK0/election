import axios from 'axios';

const SYSTEM_PROMPT = `You are an election education assistant. Your role is to explain 
electoral processes, timelines, voter rights, and civic procedures 
in a clear, neutral, and factual way.

Rules:
1. Never express political opinions or preference for any party/candidate.
2. Cite official sources when possible (Election Commission, government sites).
3. Use simple language — assume no prior civics knowledge.
4. If asked about a specific country you don't have data on, say so clearly.
5. Always encourage civic participation.
6. If the user asks a question unrelated to elections, politely guide them back to election education.
7. Keep responses concise but informative.`;

/**
 * Calls the Gemini API directly from the client in dev mode,
 * or routes through the Vercel serverless function in production.
 */
export const askGemini = async (prompt, context, history = []) => {
  // In development, call Gemini directly from the client
  if (import.meta.env.DEV) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY not set — using mock response');
      return getMockResponse(prompt, context);
    }
    return callGeminiDirect(prompt, context, history, apiKey);
  }

  // In production, use the Vercel serverless function
  try {
    const response = await axios.post('/api/chat', {
      prompt,
      context,
      history: history.slice(-10),
    });
    return response.data.text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Direct client-side call to Gemini API (dev only).
 * Uses the REST API so we don't need to bundle the full SDK.
 */
const callGeminiDirect = async (prompt, context, history, apiKey) => {
  const contextBlock = `
Current context:
- Country: ${context.country || 'Global'}
- Current Phase: ${context.currentPhase || 'Overview'}
- User role: ${context.role || 'Voter'}`;

  // Build multi-turn contents
  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT + contextBlock }] },
    { role: 'model', parts: [{ text: 'Understood. I am your election education assistant. How can I help you today?' }] },
  ];

  // Add recent history (last 5 exchanges)
  const recentHistory = (history || []).slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'bot') {
      contents.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  }

  // Current prompt
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I was unable to generate a response. Please try again.';
  } catch (error) {
    console.error('Direct Gemini call failed:', error);
    throw error;
  }
};

/**
 * Provides a neutral, factual mock response (last resort fallback).
 */
const getMockResponse = async (prompt, context) => {
  await new Promise(r => setTimeout(r, 1000));
  const c = context.country;
  return `That's an important question about the electoral process in ${c}. The AI assistant requires a valid API key to provide detailed answers. Please ensure VITE_GEMINI_API_KEY is set in your .env file, then restart the dev server.`;
};
