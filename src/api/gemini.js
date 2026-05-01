import axios from "axios";

/**
 * Calls the backend API to interact with Gemini AI.
 *
 * @param {string} prompt - The user's question or prompt.
 * @param {Object} context - Metadata about current country, phase, and user role.
 * @param {Array} [history=[]] - Recent message history for multi-turn conversation.
 * @returns {Promise<string>} The AI-generated response text.
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
