import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const goalsRouter = Router();

goalsRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getGoals());
});

goalsRouter.get('/:id', (req: Request, res: Response) => {
  const goal = serverStore.getGoalById(req.params.id);
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  res.json(goal);
});

goalsRouter.post('/', (req: Request, res: Response) => {
  try {
    const newGoal = serverStore.createGoal(req.body);
    res.status(201).json(newGoal);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

goalsRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = serverStore.updateGoal(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

goalsRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteGoal(req.params.id);
  res.status(204).send();
});

goalsRouter.patch('/:id/milestones/:milestoneId', (req: Request, res: Response) => {
  try {
    const updated = serverStore.toggleMilestone(req.params.id, req.params.milestoneId);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});
