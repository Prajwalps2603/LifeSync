import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initFirebase, getFirebaseStatus } from './firebase/firebaseConfig';
import { serverStore } from './data/store';
import { tasksRouter } from './routes/tasksRouter';
import { projectsRouter } from './routes/projectsRouter';
import { goalsRouter } from './routes/goalsRouter';
import { habitsRouter } from './routes/habitsRouter';
import { notesRouter } from './routes/notesRouter';
import { memoriesRouter } from './routes/memoriesRouter';
import { calendarRouter } from './routes/calendarRouter';
import { expensesRouter } from './routes/expensesRouter';
import { pagesRouter } from './routes/pagesRouter';
import { databasesRouter } from './routes/databasesRouter';
import { aiRouter } from './routes/aiRouter';
import { notificationsRouter } from './routes/notificationsRouter';
import { initGemini } from './services/ragService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for API calls
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[LifeSync API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check & Firebase status endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    firebase: getFirebaseStatus(),
    endpoints: [
      '/api/tasks',
      '/api/projects',
      '/api/goals',
      '/api/habits',
      '/api/notes',
      '/api/memories',
      '/api/calendar',
      '/api/expenses',
      '/api/pages',
      '/api/databases',
      '/api/ai',
      '/api/notifications',
      '/api/state'
    ]
  });
});

// Full state endpoint for rapid frontend initial synchronization
app.get('/api/state', (req: Request, res: Response) => {
  res.json(serverStore.getFullState());
});

// Mount domain routes
app.use('/api/tasks', tasksRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/memories', memoriesRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/databases', databasesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/notifications', notificationsRouter);

// 404 handler for API routes (Express v5 requires named wildcards)
app.use('/api/*path', (req: Request, res: Response) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
  console.log('='.repeat(55));
  console.log(`🚀 LifeSync Node.js API Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 State Sync:   http://localhost:${PORT}/api/state`);
  
  // Initialize Firebase (or report standby mode)
  await initFirebase();
  const fbStatus = getFirebaseStatus();
  console.log(`🔥 Firebase:     ${fbStatus.message}`);

  // Initialize Gemini AI (RAG Engine)
  const geminiOk = initGemini();
  console.log(`✨ RAG Engine:   ${geminiOk ? 'Gemini 1.5 Flash (Active)' : 'Context-Aware LifeSync RAG Engine (Fallback)'}`);
  console.log('='.repeat(55));
});
