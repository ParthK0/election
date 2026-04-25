import axios from 'axios';

/**
 * Sends a message to the Gemini API via the Vercel proxy.
 * Includes a mock fallback for local development if the API is unreachable.
 * 
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
    
    // Fallback for local development or API failure
    if (import.meta.env.DEV || error.response?.status === 404) {
      console.warn('Using mock AI response (API unreachable)');
      return getMockResponse(prompt, context);
    }
    
    throw error;
  }
};

/**
 * Provides a neutral, factual mock response based on keywords.
 */
const getMockResponse = async (prompt, context) => {
  await new Promise(r => setTimeout(r, 1000));
  const p = prompt.toLowerCase();
  const c = context.country;

  if (p.includes('register') || p.includes('enrol')) {
    return `In ${c}, voter registration is the essential first step. You typically need to provide proof of identity and residence. For specific forms and deadlines, please visit the official ${c} election commission website.`;
  }
  if (p.includes('document') || p.includes('id')) {
    return `Valid documents usually include a government-issued photo ID, passport, or utility bills. In ${c}, specific requirements may vary by state or region. It is best to check the "Learn" section for a full list of accepted documents.`;
  }
  if (p.includes('date') || p.includes('when')) {
    return `Election dates are set by the official governing body. In the "Learn" section of ElectIQ, you can find a timeline of key dates including registration deadlines, polling days, and result declarations for ${c}.`;
  }

  return `That's an important question about the electoral process in ${c}. As an AI assistant, I recommend checking the official election portal for the most up-to-date and legally binding information. Is there a specific part of the ${context.currentPhase} phase you'd like to know more about?`;
};
