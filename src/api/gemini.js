import axios from 'axios';

/**
 * Sends a message to the Gemini API via the Vercel proxy.
 * @param {string} prompt - The user's question.
 * @param {Object} context - Country, phase, role, etc.
 * @returns {Promise<string>} - The AI's response.
 */
export const askGemini = async (prompt, context) => {
  try {
    const response = await axios.post('/api/chat', {
      prompt,
      context,
    });
    return response.data.text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
