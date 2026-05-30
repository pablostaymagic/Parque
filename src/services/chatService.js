/**
 * Service to handle communication with the Virtual Assistant backend.
 * This service calls the secure /api/chat endpoint to interact with Groq API.
 */

const STORAGE_KEY = 'chatbot_public_content';

/**
 * Local Fallback logic in case the API is unavailable or for local testing.
 * Searches for the most relevant paragraph based on keyword matching.
 */
const getLocalResponse = (question, knowledgeBase) => {
  if (!knowledgeBase || !knowledgeBase.trim()) {
    return "No hay información cargada todavía para el asistente.";
  }

  const q = question.toLowerCase().trim();
  const blocks = knowledgeBase.split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 0);
  const queryWords = q.split(/\s+/).filter(w => w.length > 3);

  let bestBlock = null;
  let maxScore = 0;

  blocks.forEach(block => {
    const lowerBlock = block.toLowerCase();
    let score = 0;
    if (lowerBlock.includes(q)) score += 10;
    queryWords.forEach(word => {
      if (lowerBlock.includes(word)) score += 2;
    });

    if (score > maxScore) {
      maxScore = score;
      bestBlock = block;
    }
  });

  if (maxScore > 0) return bestBlock;
  
  return "No tengo esa información cargada todavía. Te recomiendo consultar con el personal del lugar.";
};

/**
 * Main function to send a question to the assistant.
 * It first checks if there's any knowledge loaded, then tries the API, 
 * and finally falls back to local search.
 */
export const askVirtualAssistant = async (question) => {
  const knowledgeBase = localStorage.getItem(STORAGE_KEY) || '';

  // 1. Pre-validation
  if (!knowledgeBase.trim()) {
    return "No hay información cargada todavía para el asistente.";
  }

  // 2. Length validation
  if (question.length > 250) {
    return "Tu pregunta es muy larga. Por favor, intenta ser más breve.";
  }

  // 3. Security Filter (Simple)
  const privateKeywords = ['password', 'contraseña', 'tarjeta', 'pago', 'documento', 'cédula'];
  if (privateKeywords.some(key => question.toLowerCase().includes(key))) {
    return "No puedo responder a preguntas que involucren información privada o personal.";
  }

  try {
    // Attempt to call the secure backend endpoint
    // Note: The GROQ_API_KEY is managed on the server side (/api/chat)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question,
        knowledgeBase: knowledgeBase
      })
    });

    if (!response.ok) throw new Error('API Unavailable');

    const data = await response.json();
    return data.answer;

  } catch (error) {
    console.warn("Virtual Assistant: Falling back to local search due to API error.", error);
    
    // 4. Fallback to Local Search
    return getLocalResponse(question, knowledgeBase);
  }
};
