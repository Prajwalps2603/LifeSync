import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const pagesRouter = Router();

pagesRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getPages());
});

pagesRouter.get('/:id', (req: Request, res: Response) => {
  const page = serverStore.getPageById(req.params.id);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

pagesRouter.post('/', (req: Request, res: Response) => {
  try {
    const newPage = serverStore.createPage(req.body);
    res.status(201).json(newPage);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

pagesRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = serverStore.updatePage(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

pagesRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deletePage(req.params.id);
  res.status(204).send();
});
