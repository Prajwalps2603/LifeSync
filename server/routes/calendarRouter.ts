import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const calendarRouter = Router();

calendarRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getEvents());
});

calendarRouter.post('/', (req: Request, res: Response) => {
  try {
    const newEvent = serverStore.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

calendarRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteEvent(req.params.id);
  res.status(204).send();
});
