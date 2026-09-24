import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const projectsRouter = Router();

projectsRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getProjects());
});

projectsRouter.get('/:id', (req: Request, res: Response) => {
  const project = serverStore.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

projectsRouter.post('/', (req: Request, res: Response) => {
  try {
    const newProj = serverStore.createProject(req.body);
    res.status(201).json(newProj);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

projectsRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = serverStore.updateProject(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

projectsRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteProject(req.params.id);
  res.status(204).send();
});
