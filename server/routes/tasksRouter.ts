import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const tasksRouter = Router();

// GET all tasks
tasksRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getTasks());
});

// GET task by ID
tasksRouter.get('/:id', (req: Request, res: Response) => {
  const task = serverStore.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST create task
tasksRouter.post('/', (req: Request, res: Response) => {
  try {
    const newTask = serverStore.createTask(req.body);
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update task
tasksRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = serverStore.updateTask(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// PATCH toggle task status
tasksRouter.patch('/:id/toggle', (req: Request, res: Response) => {
  try {
    const toggled = serverStore.toggleTask(req.params.id);
    res.json(toggled);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE task
tasksRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteTask(req.params.id);
  res.status(204).send();
});
