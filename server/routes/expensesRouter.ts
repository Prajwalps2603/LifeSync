import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const expensesRouter = Router();

expensesRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getExpenses());
});

expensesRouter.post('/', (req: Request, res: Response) => {
  try {
    const newExp = serverStore.createExpense(req.body);
    res.status(201).json(newExp);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

expensesRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteExpense(req.params.id);
  res.status(204).send();
});
