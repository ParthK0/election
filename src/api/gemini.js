import axios from "axios";

/**
 * Calls the Vercel serverless function (or local express mock) to interact with Gemini.
 * Never calls Gemini directly from the client.
 */
export const askGemini = async (prompt, context, history = []) => {
  try {
    const response = await axios.post("/api/chat", {
      prompt,
      context,
      history: history.slice(-10),
    });
    return response.data.text;
  } catch (error) {
    console.error("Error calling Gemini API proxy:", error);
    throw error;
  }
};
