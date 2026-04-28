import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// API Route for AI Chat
app.post('/api/chat', async (req, res) => {
  const { prompt, context, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const contextBlock = `
Current context:
- Country: ${context?.country || 'Global'}
- Current Phase: ${context?.currentPhase || 'Overview'}
- User role: ${context?.role || 'Voter'}`;

    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT + contextBlock }] },
      { role: 'model', parts: [{ text: 'Understood. I am your election education assistant. How can I help you today?' }] }
    ];

    if (Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: msg.content }] });
        } else if (msg.role === 'bot' || msg.role === 'model') {
          contents.push({ role: 'model', parts: [{ text: msg.content || msg.text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    return res.json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Always return the main index.html for any other route (Client-side routing)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
