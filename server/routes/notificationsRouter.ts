import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const notificationsRouter = Router();

notificationsRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getNotifications());
});

notificationsRouter.patch('/:id/read', (req: Request, res: Response) => {
  const updated = serverStore.markNotificationRead(req.params.id);
  res.json(updated);
});

notificationsRouter.patch('/read-all', (req: Request, res: Response) => {
  const updated = serverStore.markAllNotificationsRead();
  res.json(updated);
});
