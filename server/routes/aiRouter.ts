import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const aiRouter = Router();

aiRouter.get('/insights', (req: Request, res: Response) => {
  res.json(serverStore.getInsights());
});

aiRouter.get('/messages', (req: Request, res: Response) => {
  res.json(serverStore.getMessages());
});

aiRouter.post('/chat', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text prompt is required' });
  const result = serverStore.sendMessage(text);
  res.json(result);
});

aiRouter.post('/parse', (req: Request, res: Response) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input is required' });
  const result = serverStore.parseNaturalLanguage(input);
  res.json(result);
});
