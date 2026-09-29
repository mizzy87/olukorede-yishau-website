import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const DISPATCHES_FILE = path.join(DATA_DIR, 'dispatches.json');

// Ensure data files exist helper
async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(INQUIRIES_FILE);
    } catch {
      await fs.writeFile(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    try {
      await fs.access(CONFIG_FILE);
    } catch {
      await fs.writeFile(CONFIG_FILE, JSON.stringify({ inboundEmail: '', notificationsEnabled: true }, null, 2), 'utf-8');
    }
    try {
      await fs.access(DISPATCHES_FILE);
    } catch {
      await fs.writeFile(DISPATCHES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring data files:', err);
  }
}

await ensureDataFiles();

// Helper to safely read JSON
async function readJson(filePath, fallback = []) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`Could not read ${filePath}, using fallback:`, err.message);
    return fallback;
  }
}

// Helper to safely write JSON
async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==========================================================================
// 1. SYSTEM HEALTH & METRICS API
// ==========================================================================
app.get('/api/health', async (req, res) => {
  const inquiries = await readJson(INQUIRIES_FILE, []);
  const config = await readJson(CONFIG_FILE, {});
  
  res.json({
    status: 'online',
    version: '1.2.0',
    firm: 'Yishau Strategic Media & Advisory',
    bureaus: {
      lagos: { status: 'operational', timezone: 'WAT (UTC+1)' },
      washington: { status: 'operational', timezone: 'EDT (UTC-4)' }
    },
    metrics: {
      totalMandates: inquiries.length,
      pendingNdas: inquiries.filter(i => i.status === 'Pending Review' || i.status === 'NDA Dispatched').length,
      inboundEmailConfigured: Boolean(config.inboundEmail && config.inboundEmail.trim())
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ==========================================================================
// 2. CONFIGURATION & INBOUND EMAIL API
// ==========================================================================
app.get('/api/config', async (req, res) => {
  const config = await readJson(CONFIG_FILE, { inboundEmail: '', notificationsEnabled: true });
  res.json({
    inboundEmail: config.inboundEmail || '',
    notificationsEnabled: config.notificationsEnabled ?? true,
    updatedAt: config.updatedAt || null
  });
});

app.post('/api/config', async (req, res) => {
  const { inboundEmail, notificationsEnabled } = req.body || {};
  
  if (inboundEmail !== undefined && typeof inboundEmail !== 'string') {
    return res.status(400).json({ error: 'inboundEmail must be a string' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanEmail = (inboundEmail || '').trim();
  if (cleanEmail && !emailPattern.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const currentConfig = await readJson(CONFIG_FILE, {});
  const updated = {
    ...currentConfig,
    inboundEmail: cleanEmail,
    notificationsEnabled: notificationsEnabled !== undefined ? Boolean(notificationsEnabled) : currentConfig.notificationsEnabled ?? true,
    updatedAt: new Date().toISOString()
  };

  await writeJson(CONFIG_FILE, updated);

  res.json({
    success: true,
    message: cleanEmail ? `Inbound recipient email connected to ${cleanEmail}.` : 'Inbound email reset to blank.',
    config: updated
  });
});

// ==========================================================================
// 3. CORPORATE MANDATES & RFP INQUIRIES API
// ==========================================================================
const PRACTICE_LABELS = {
  csuite: 'C-Suite Strategic Communications & Op-Eds',
  crisis: '24/7 Crisis Communications & War Room',
  diligence: 'Investigative Due Diligence & Narrative Inquest',
  publishing: 'Corporate Publishing & Executive Monograph',
  broadcast: 'Media Interrogation & Broadcast Readiness',
  general: 'Boardroom Counsel & General Inquiry'
};

const BUDGET_LABELS = {
  'tier-standard': 'Executive Retainer ($10,000 – $25,000 / month)',
  'tier-surge': 'Crisis War Room & Surge ($25,000 – $75,000)',
  'tier-monograph': 'Enterprise Monograph Project ($50,000 – $120,000)',
  'tier-custom': 'Custom Institutional Mandate'
};

// GET: List all inquiries
app.get('/api/inquiries', async (req, res) => {
  const inquiries = await readJson(INQUIRIES_FILE, []);
  const { status, type, tag } = req.query;

  let filtered = inquiries;
  if (status) {
    filtered = filtered.filter(i => i.status?.toLowerCase() === status.toLowerCase());
  }
  if (type) {
    filtered = filtered.filter(i => i.inquiryType?.toLowerCase() === type.toLowerCase());
  }
  if (tag) {
    const searchTag = tag.trim().toLowerCase();
    filtered = filtered.filter(i => (i.tags || []).some(t => t.toLowerCase() === searchTag));
  }

  res.json({
    total: filtered.length,
    inquiries: filtered
  });
});

// POST: Create a new RFP mandate inquiry
app.post('/api/inquiries', async (req, res) => {
  const { name, email, company, inquiryType, budget, nda, message, tags } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Client full name & title is required.' });
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Corporate email address is required.' });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid corporate email address format.' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Mandate context and core objectives are required.' });
  }

  const inquiries = await readJson(INQUIRIES_FILE, []);
  const config = await readJson(CONFIG_FILE, {});

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `YSM-${dateStr}-${randomSuffix}`;

  const sanitizedTags = Array.isArray(tags)
    ? tags.map(t => typeof t === 'string' ? (t.trim().startsWith('#') ? t.trim() : '#' + t.trim()) : '').filter(Boolean)
    : [];

  const newInquiry = {
    id,
    createdAt: now.toISOString(),
    name: name.trim(),
    email: email.trim(),
    company: (company || 'Enterprise Entity').trim(),
    inquiryType: inquiryType || 'csuite',
    inquiryTypeLabel: PRACTICE_LABELS[inquiryType] || 'Strategic Communications Advisory',
    budget: budget || 'tier-standard',
    budgetLabel: BUDGET_LABELS[budget] || 'Custom Institutional Mandate',
    nda: Boolean(nda ?? true),
    message: message.trim(),
    tags: sanitizedTags,
    status: 'Pending Review',
    notes: 'Submitted via Yishau Strategic Advisory Consultation Desk.'
  };

  inquiries.unshift(newInquiry);
  await writeJson(INQUIRIES_FILE, inquiries);

  // If inbound email is configured, simulate server notification dispatch
  const hasInboundRecipient = Boolean(config.inboundEmail && config.inboundEmail.trim());
  const dispatchedTo = hasInboundRecipient ? config.inboundEmail : null;

  res.status(201).json({
    success: true,
    message: 'Corporate mandate registered under strict fiduciary confidentiality.',
    reference: id,
    inquiry: newInquiry,
    notification: {
      dispatched: hasInboundRecipient,
      recipient: dispatchedTo
    }
  });
});

// PATCH: Update an inquiry's status, notes, or tags
app.patch('/api/inquiries/:id', async (req, res) => {
  const { id } = req.params;
  const { status, notes, tags } = req.body || {};

  const inquiries = await readJson(INQUIRIES_FILE, []);
  const index = inquiries.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Mandate with ID "${id}" not found.` });
  }

  if (status) {
    inquiries[index].status = status;
  }
  if (notes !== undefined) {
    inquiries[index].notes = notes;
  }
  if (Array.isArray(tags)) {
    inquiries[index].tags = tags.map(t => typeof t === 'string' ? (t.trim().startsWith('#') ? t.trim() : '#' + t.trim()) : '').filter(Boolean);
  }
  inquiries[index].updatedAt = new Date().toISOString();

  await writeJson(INQUIRIES_FILE, inquiries);

  res.json({
    success: true,
    message: `Mandate ${id} updated successfully.`,
    inquiry: inquiries[index]
  });
});

// DELETE: Delete an inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  const { id } = req.params;
  const inquiries = await readJson(INQUIRIES_FILE, []);
  const initialLength = inquiries.length;
  const updated = inquiries.filter(i => i.id !== id);

  if (updated.length === initialLength) {
    return res.status(404).json({ error: `Mandate with ID "${id}" not found.` });
  }

  await writeJson(INQUIRIES_FILE, updated);
  res.json({ success: true, message: `Mandate ${id} removed.` });
});

// ==========================================================================
// 4. EXECUTIVE DISPATCHES API
// ==========================================================================
app.get('/api/dispatches', async (req, res) => {
  const dispatches = await readJson(DISPATCHES_FILE, []);
  res.json({
    total: dispatches.length,
    dispatches
  });
});

// ==========================================================================
// 5. ESTIMATOR & FEE CALCULATION ENGINE API
// ==========================================================================
app.post('/api/estimator/calculate', (req, res) => {
  const { practiceArea, scopeScale, urgency, broadsheetSyndication } = req.body || {};

  const BASE_FEES = {
    csuite: 15000,
    crisis: 35000,
    diligence: 25000,
    publishing: 65000,
    broadcast: 18000,
    general: 12000
  };

  const SCALE_MULTIPLIERS = {
    tier1: 1.0,  // Standard corporate division
    tier2: 1.45, // Multinational conglomerate
    tier3: 2.1   // Sovereign entity / global consortium
  };

  const URGENCY_MULTIPLIERS = {
    standard: 1.0,
    surge: 1.35,
    critical: 1.75
  };

  const base = BASE_FEES[practiceArea] || 15000;
  const scale = SCALE_MULTIPLIERS[scopeScale] || 1.0;
  const surge = URGENCY_MULTIPLIERS[urgency] || 1.0;
  const syndicationAddOn = broadsheetSyndication ? 8500 : 0;

  const totalFee = Math.round((base * scale * surge) + syndicationAddOn);
  const retainerEstMonthly = Math.round(totalFee / 3);

  res.json({
    practiceArea: practiceArea || 'csuite',
    estimatedTotalUsd: totalFee,
    estimatedMonthlyRetainerUsd: retainerEstMonthly,
    timelineWeeks: practiceArea === 'publishing' ? 24 : practiceArea === 'crisis' ? 4 : 12,
    deliverables: [
      'Dedicated Senior Fiduciary Communications Director',
      'Confidential War Room & Strategy Dossier',
      'Primary Broadsheet & Institutional Wire Alignment',
      '24-hour Mutual NDA & Regulatory Escrow Protocol'
    ]
  });
});

// ==========================================================================
// 6. EXECUTIVE AI ASSISTANT CHAT API
// ==========================================================================
const SYSTEM_INSTRUCTION = `You are the Executive Client Advisory Assistant for Yishau Strategic Media & Advisory — a premier transatlantic strategic communications, narrative intelligence, crisis management, and corporate publishing consultancy led by Managing Principal Olukorede Yishau.

Firm Overview & Credentials:
- Managing Principal: Olukorede Yishau — acclaimed author, veteran investigative journalist with 25+ years experience, United States Bureau Chief, and multiple-time Nigeria Media Merit Award (NMMA) laureate.
- Transatlantic Footprint: Offices in Lagos, Nigeria and Washington D.C., USA.
- Track Record: Advised on $450M+ in cross-border capital transactions and M&A communications, 120+ executive dossiers and monographs delivered, 100% discretion and fiduciary confidentiality.

Core Advisory Practice Areas:
1. C-Suite Strategic Communications & Boardroom Advisory: Executive ghostwriting, CEO keynotes, shareholder letters, and broadsheet op-ed syndication across top international dailies (The Nation, Financial Times, The Guardian).
2. Crisis Communications & 24/7 War Room: Rapid-response containment for regulatory probes, corporate litigation, stakeholder disputes, and cross-border media crises.
3. Investigative Due Diligence & Narrative Intelligence: Pre-merger narrative audits, whistleblower inquests, supply chain integrity dossiers, and counter-disinformation audits.
4. Corporate Publishing & Executive Monographs: Full-cycle book packaging, ghostwriting, editorial direction, and global book distribution for founders and industrial captains.
5. Executive Media Interrogation & Broadcast Readiness: High-pressure camera drills, parliamentary / congressional inquiry simulations, and crisis press conference training.

Engagement Models & Retainers:
- Executive Thought Leadership Retainer: Ongoing strategic counsel, 2 executive op-eds monthly, continuous media monitoring.
- Special Situations & Crisis Rapid Response: Dedicated 24/7 war room team, regulatory briefings, rapid media containment.
- Enterprise Monograph & Legacy Publishing: 6–9 month full-lifecycle book production, ghostwriting, international launch.

Client Inquiry Protocol:
Advise visitors to submit a formal corporate RFP via the "Corporate Consultation Desk" form on this site or use the interactive Scope & Fee Calculator to model their engagement parameters.

Tone: Authoritative, polished, discreet, executive, and commercially astute. Format replies with clear paragraphs and crisp bullet points.`;

const getLocalFallbackReply = (query) => {
  const q = (query || '').toLowerCase();
  if (q.includes('service') || q.includes('practice') || q.includes('capabilit') || q.includes('offer') || q.includes('what do you do')) {
    return "Yishau Strategic Media & Advisory provides five core practice areas for corporate leaders and enterprises:\n\n1. **C-Suite Strategic Communications**: Boardroom counsel, executive ghostwriting, and top-tier broadsheet op-ed syndication.\n2. **Crisis Communications & 24/7 War Room**: Rapid-response media containment for regulatory inquiries, litigation, and market crises.\n3. **Investigative Due Diligence & Narrative Intelligence**: Pre-transaction narrative forensics, counter-disinformation audits, and supply chain integrity dossiers.\n4. **Corporate Publishing & Executive Monographs**: Turnkey book packaging, ghostwriting, and international distribution for chairpersons and industry pioneers.\n5. **Executive Media Interrogation & Broadcast Readiness**: High-intensity on-camera drills and congressional hearing simulations.\n\nYou can explore our full capabilities or configure your engagement scope directly on this site!";
  }
  if (q.includes('retainer') || q.includes('cost') || q.includes('price') || q.includes('fee') || q.includes('package') || q.includes('tier')) {
    return "We offer three primary engagement structures tailored to corporate scale and urgency:\n\n- **Executive Thought Leadership Retainer**: Ongoing monthly counsel, 2 strategic broadsheet op-eds, CEO keynote drafting, and media monitoring.\n- **Special Situations & Crisis War Room**: 24/7 rapid response activation, dedicated crisis response team, and stakeholder narrative containment.\n- **Corporate Monograph & Legacy Publishing**: Full 6–9 month engagement covering manuscript ghostwriting, legal review, and international distribution.\n\nUse our interactive **Engagement Scope Builder** on the page or submit an RFP to receive an itemized mandate proposal.";
  }
  if (q.includes('case study') || q.includes('track record') || q.includes('client') || q.includes('result') || q.includes('impact')) {
    return "Our senior team has advised on landmark transactions and market challenges across West Africa, Europe, and North America:\n\n- **$1.2B Capital Restructuring**: Coordinated global narrative and broadsheet coverage for a pan-African energy consortium across Lagos, London, and New York with zero regulatory leakages.\n- **Fintech Unicorn Regulatory Defense**: Guided a high-growth fintech through cross-border central bank scrutiny, securing license restoration in 14 days and closing a $65M Series B.\n- **Industrial Titan Monograph**: Authored and published a bestselling 320-page corporate biography, distributing 40,000+ copies globally.\n- **Whistleblower ESG Inquest**: Uncovered an $80M procurement conduit, triggering legislative reform and earning national media merit honors.";
  }
  if (q.includes('book') || q.includes('author') || q.includes('publish') || q.includes('novel')) {
    return "Managing Principal Olukorede Yishau is an acclaimed novelist and essayist whose published works include:\n\n- **In the Name of Our Father** (Longlisted for the NLNG Nigeria Prize for Literature)\n- **Vaults of Secrets** (Critically celebrated short story collection)\n- **After The End** (Deeply acclaimed novel exploring grief, traditions, and resilience)\n\nWe bring this literary mastery directly to executive biographies and corporate monographs through our **Corporate Publishing Practice**.";
  }
  if (q.includes('contact') || q.includes('hire') || q.includes('rfp') || q.includes('consult') || q.includes('proposal') || q.includes('schedule')) {
    return "To engage Yishau Strategic Media & Advisory:\n\n1. Scroll to the **Corporate Consultation Desk & RFP** section below.\n2. Submit your institutional mandate, scope requirements, and timeline.\n3. We execute mutual non-disclosure agreements (NDAs) within 24 hours prior to confidential discovery sessions.";
  }
  return "Welcome to Yishau Strategic Media & Advisory. We provide boardroom strategic communications, 24/7 crisis war room advisory, investigative narrative intelligence, and executive book publishing for enterprise leaders across Lagos and Washington D.C. How can we assist your executive team today?";
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

  const localReply = getLocalFallbackReply(message);
  return res.json({ reply: localReply });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Backend Engine] Yishau Strategic Media & Advisory Server running at http://0.0.0.0:${PORT}`);
  console.log(`[Backend Engine] Inquiries API: http://0.0.0.0:${PORT}/api/inquiries`);
  console.log(`[Backend Engine] Health API:    http://0.0.0.0:${PORT}/api/health`);
});
