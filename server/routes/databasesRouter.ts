import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const databasesRouter = Router();

databasesRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getDatabases());
});

databasesRouter.get('/:id', (req: Request, res: Response) => {
  const db = serverStore.getDatabaseById(req.params.id);
  if (!db) return res.status(404).json({ error: 'Database not found' });
  res.json(db);
});

databasesRouter.post('/:id/rows', (req: Request, res: Response) => {
  try {
    const updated = serverStore.addRow(req.params.id, req.body);
    res.status(201).json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});
