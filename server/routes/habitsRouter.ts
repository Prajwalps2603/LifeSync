import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const habitsRouter = Router();

habitsRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getHabits());
});

habitsRouter.get('/:id', (req: Request, res: Response) => {
  const habit = serverStore.getHabitById(req.params.id);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  res.json(habit);
});

habitsRouter.post('/', (req: Request, res: Response) => {
  try {
    const newHabit = serverStore.createHabit(req.body);
    res.status(201).json(newHabit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

habitsRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = serverStore.updateHabit(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

habitsRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteHabit(req.params.id);
  res.status(204).send();
});

habitsRouter.patch('/:id/toggle-date', (req: Request, res: Response) => {
  try {
    const { dateStr } = req.body;
    if (!dateStr) return res.status(400).json({ error: 'dateStr is required' });
    const updated = serverStore.toggleHabitDate(req.params.id, dateStr);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});
