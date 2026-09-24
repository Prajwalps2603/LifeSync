import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const memoriesRouter = Router();

memoriesRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getMemories());
});

memoriesRouter.post('/', (req: Request, res: Response) => {
  try {
    const newMemory = serverStore.createMemory(req.body);
    res.status(201).json(newMemory);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

memoriesRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = serverStore.updateMemory(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

memoriesRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteMemory(req.params.id);
  res.status(204).send();
});
