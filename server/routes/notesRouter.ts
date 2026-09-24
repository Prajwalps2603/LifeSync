import { Router, Request, Response } from 'express';
import { serverStore } from '../data/store';

export const notesRouter = Router();

notesRouter.get('/', (req: Request, res: Response) => {
  res.json(serverStore.getNotes());
});

notesRouter.get('/:id', (req: Request, res: Response) => {
  const note = serverStore.getNoteById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

notesRouter.post('/', (req: Request, res: Response) => {
  try {
    const newNote = serverStore.createNote(req.body);
    res.status(201).json(newNote);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

notesRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = serverStore.updateNote(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

notesRouter.delete('/:id', (req: Request, res: Response) => {
  serverStore.deleteNote(req.params.id);
  res.status(204).send();
});
