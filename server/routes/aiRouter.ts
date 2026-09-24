import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';
import { ragChat, mockRagResponse, isGeminiEnabled } from '../services/ragService';

export const aiRouter = Router();

aiRouter.get('/status', (req: Request, res: Response) => {
  res.json({
    ragEnabled: true,
    geminiConfigured: isGeminiEnabled(),
    engine: isGeminiEnabled() ? 'Gemini 1.5 Flash (RAG Active)' : 'Context-Aware LifeSync RAG Engine (Local/Mock Mode)',
  });
});

aiRouter.get('/insights', (req: Request, res: Response) => {
  res.json(serverStore.getInsights());
});

aiRouter.get('/messages', (req: Request, res: Response) => {
  res.json(serverStore.getMessages());
});

aiRouter.post('/chat', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text prompt is required' });

  let aiReply = '';
  if (isGeminiEnabled()) {
    try {
      aiReply = await ragChat(text);
    } catch (err: any) {
      console.warn('[RAG] Gemini error, using fallback RAG engine:', err.message);
      aiReply = mockRagResponse(text);
    }
  } else {
    aiReply = mockRagResponse(text);
  }

  const result = serverStore.sendMessage(text, aiReply);
  res.json(result);
});

aiRouter.post('/parse', (req: Request, res: Response) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input is required' });
  const result = serverStore.parseNaturalLanguage(input);
  res.json(result);
});
