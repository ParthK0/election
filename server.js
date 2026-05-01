import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com", "https://www.googletagmanager.com"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://*.firebaseio.com", "wss://*.firebaseio.com", "https://www.google-analytics.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/', apiLimiter);

const allowedOrigins = [
  'https://electiq-production.web.app',
  'https://electiq-production.firebaseapp.com',
  'https://election-186840368227.us-central1.run.app',
  'http://localhost:5173',
  'http://localhost:8080'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' })); // Add limit to prevent payload too large attacks

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

let genAI = null;
const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

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

const ChatSchema = z.object({
  prompt: z.string().min(1).max(500).trim(),
  context: z.object({
    country: z.string().optional(),
    currentPhase: z.string().optional(),
    role: z.string().optional(),
    checklist: z.object({
      completed: z.array(z.string()).optional(),
      remaining: z.array(z.string()).optional()
    }).optional()
  }).optional(),
  history: z.array(z.object({
    role: z.string(),
    content: z.string().max(1000).optional(),
    text: z.string().max(1000).optional()
  })).max(10).optional()
});

// API Route for AI Chat
app.post('/api/chat', async (req, res) => {
  const parsed = ChatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
  }

  const { prompt, context, history } = parsed.data;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const aiInstance = getGenAI();
    const model = aiInstance.getGenerativeModel({ model: "gemini-2.0-flash" });

    let checklistText = 'No checklist data provided.';
    if (context?.checklist) {
      const { completed, remaining } = context.checklist;
      checklistText = `
  Completed Actions: ${completed?.length ? completed.join(', ') : 'None'}
  Remaining Actions: ${remaining?.length ? remaining.join(', ') : 'None'}`;
    }

    const contextBlock = `
Current context:
- Country: ${context?.country || 'Global'}
- Current Phase: ${context?.currentPhase || 'Overview'}
- User role: ${context?.role || 'Voter'}
- Checklist Progress: ${checklistText}`;

    const historyPayload = [];
    if (Array.isArray(history)) {
      history.slice(-10).forEach(msg => {
        const role = (msg.role === 'user') ? 'user' : 'model';
        const text = msg.content || msg.text || '';
        if (text) {
          historyPayload.push({ role, parts: [{ text }] });
        }
      });
    }

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + contextBlock }] },
        { role: 'model', parts: [{ text: 'Understood. I am your election education assistant. How can I help you today?' }] },
        ...historyPayload
      ]
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Always return the main index.html for any other route (Client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});
