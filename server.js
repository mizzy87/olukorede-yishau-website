import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const SYSTEM_INSTRUCTION = `You are the personal Work & Literary AI Assistant for Olukorede Yishau — acclaimed Nigerian investigative journalist, novelist, and United States Bureau Chief / Associate Editor at The Nation newspaper.

Your role is to answer visitor questions accurately, warmly, and concisely about Olukorede Yishau's work, books, investigative reporting, career, awards, and availability for projects.

Key Knowledge Base:
- Identity: Olukorede Yishau is a distinguished Nigerian author and senior investigative journalist with 25+ years of experience (since 1999). Based between Lagos, Nigeria, and Washington D.C., USA.
- Published Literary Books:
  1. "In the Name of Our Father" (2018) - Acclaimed debut novel exposing religious hypocrisy, state tyranny, and military dictatorship. Longlisted for the prestigious Nigeria Prize for Literature (NLNG).
  2. "Vaults of Secrets" (2020) - Gripping collection of short stories exploring betrayal, emotional resilience, prison conditions, and the Nigerian condition.
  3. "After The End" (2024) - Deeply emotional novel addressing widowhood, grief, societal expectations, inheritance traditions, and resilience in contemporary society.
- Investigative Journalism & Columns:
  - Lead Investigation: "The Shadow Pipeline" (tracking multi-billion offshore conduits and illicit capital flight).
  - "Ghost Contractors & Decaying Schools" (highlighting abandoned infrastructure in the Niger Delta).
  - Cross-border exposés on human trafficking rings in the Sahel corridor.
  - Highly influential weekly editorial columns at The Nation Newspaper focusing on democracy, social justice, and governance.
- Accolades & Recognition:
  - Multiple-time winner of the Nigerian Media Merit Award (NMMA), including Columnist of the Year and Investigative Reporter honours.
  - Diamond Awards for Media Excellence (DAME) laureate and finalist.
  - Longlisted for the NLNG Nigeria Prize for Literature.
  - Associate Editor and United States Bureau Chief for The Nation.
- Professional Offerings & Services:
  - Investigative Commissions & In-depth Reporting
  - Literary Fiction & Creative Non-Fiction Consulting
  - Editorial Leadership, Book Editing & Ghostwriting
  - Keynote Speeches, Literary Festivals & Media Masterclasses
- Inquiries & Booking:
  - Visitors can submit project requests directly through the "Let's Work Together" form on this website or reach out for literary rights, press interviews, and speaking engagements.

Tone: Professional, dignified, knowledgeable, warm, and distinctly editorial. Keep answers focused, crisp, and helpful. Format responses with clean paragraphs and bullet points where helpful.`;

// Local fallback knowledge responder if API key is not configured or in case of network issues
const getLocalFallbackReply = (query) => {
  const q = (query || '').toLowerCase();
  if (q.includes('book') || q.includes('novel') || q.includes('published') || q.includes('write') || q.includes('author')) {
    return "Olukorede Yishau has authored three critically acclaimed literary works:\n\n1. **In the Name of Our Father** (2018) – A celebrated novel examining religious charlatanism, political tyranny, and moral courage. It was longlisted for the Nigeria Prize for Literature (NLNG).\n2. **Vaults of Secrets** (2020) – A gripping short story collection exploring betrayal, resilience, and the complexities of human condition.\n3. **After The End** (2024) – A poignant exploration of grief, widowhood traditions, societal expectations, and personal redemption.\n\nYou can read excerpts of his works directly in the Selected Work section above!";
  }
  if (q.includes('award') || q.includes('prize') || q.includes('honour') || q.includes('recognition') || q.includes('nmma')) {
    return "Olukorede Yishau is a decorated journalist and author with numerous industry recognitions:\n\n- **Nigeria Media Merit Award (NMMA)**: Multiple-time winner, including *Columnist of the Year* and *Investigative Reporter*.\n- **Nigeria Prize for Literature (NLNG)**: Longlisted for his novel *In the Name of Our Father*.\n- **Diamond Awards for Media Excellence (DAME)**: Multiple-time finalist and laureate.\n- **Editorial Leadership**: Recognized as United States Bureau Chief and Associate Editor for The Nation newspaper.";
  }
  if (q.includes('investigat') || q.includes('journalis') || q.includes('article') || q.includes('nation') || q.includes('column')) {
    return "With over 25+ years in journalism, Olukorede Yishau has broken major investigative stories:\n\n- **The Shadow Pipeline**: Forensic investigations into multi-billion offshore conduits and illicit wealth expatriation.\n- **Ghost Contractors & Decaying Niger Delta Schools**: Ground-level reporting uncovering abandoned public infrastructure.\n- **The Unbroken Chains**: Cross-border exposés on human trafficking networks across the Sahel.\n- **Weekly Columns**: Thought-provoking socio-political analyses syndicated across Nigeria and internationally.";
  }
  if (q.includes('contact') || q.includes('hire') || q.includes('work') || q.includes('email') || q.includes('commission') || q.includes('service')) {
    return "You can collaborate with Olukorede Yishau for:\n\n- Investigative Reporting & Feature Commissions\n- Literary Manuscripts & Ghostwriting\n- Editorial Direction & Strategic Communication\n- Keynotes, Literary Panels & University Masterclasses\n\nTo start a conversation, scroll to the **Let's Work Together** section below or submit an inquiry using the direct desk form!";
  }
  return "Olukorede Yishau is an acclaimed Nigerian author, investigative journalist, and United States Bureau Chief with 25+ years of experience. He is known for award-winning novels like *In the Name of Our Father*, *Vaults of Secrets*, and *After The End*, alongside pioneering investigative reporting. How can I help you learn more about his books, journalism, or project collaborations?";
};

app.post('/api/assistant/chat', async (req, res) => {
  const { message, conversationHistory } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents = [];
      if (Array.isArray(conversationHistory)) {
        for (const turn of conversationHistory.slice(-6)) {
          if (turn && turn.text && (turn.role === 'user' || turn.role === 'assistant')) {
            contents.push({
              role: turn.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: turn.text }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText = response.text || getLocalFallbackReply(message);
      return res.json({ reply: replyText });
    } catch (err) {
      console.warn('Gemini API request failed, utilizing local knowledge engine:', err.message);
      const fallbackReply = getLocalFallbackReply(message);
      return res.json({ reply: fallbackReply });
    }
  }

  // Graceful fallback when GEMINI_API_KEY is not configured
  const localReply = getLocalFallbackReply(message);
  return res.json({ reply: localReply });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
