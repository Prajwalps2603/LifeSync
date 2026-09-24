/**
 * LifeSync Frontend API Service Layer
 * 
 * All calls go to the Node.js / Express backend at /api/*.
 * The Vite dev proxy forwards them to http://localhost:5000 during development.
 * In production, your server should serve the built frontend from the /dist folder.
 */

import {
  Task, Project, Goal, Habit, Note, Memory, CalendarEvent,
  Expense, WorkspacePage, Database, AIInsight, AppNotification,
  ChatMessage
} from '../types';

// ─── Base Fetch Utility ─────────────────────────────────────────────────────

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

// ─── Reactive Store Shim ─────────────────────────────────────────────────────
// Keeps compatibility with existing components that call `store.subscribe()`
// and use store.* to read data. The store is refreshed from the server
// after each mutation, and subscribers (components) are notified.

interface FullState {
  tasks: Task[];
  projects: Project[];
  goals: Goal[];
  habits: Habit[];
  notes: Note[];
  memories: Memory[];
  calendarEvents: CalendarEvent[];
  expenses: Expense[];
  pages: WorkspacePage[];
  databases: Database[];
  insights: AIInsight[];
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
}

class AppStore {
  tasks: Task[] = [];
  projects: Project[] = [];
  goals: Goal[] = [];
  habits: Habit[] = [];
  notes: Note[] = [];
  memories: Memory[] = [];
  calendarEvents: CalendarEvent[] = [];
  expenses: Expense[] = [];
  pages: WorkspacePage[] = [];
  databases: Database[] = [];
  insights: AIInsight[] = [];
  notifications: AppNotification[] = [];
  chatMessages: ChatMessage[] = [];

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  async hydrate() {
    try {
      const state = await apiFetch<FullState>('/api/state');
      Object.assign(this, state);
      this.notify();
    } catch (err) {
      console.warn('[LifeSync] Could not reach the backend server. Is `npm run server` running?', err);
    }
  }
}

export const store = new AppStore();

// Hydrate the store from the server on startup
store.hydrate();

// ─── Task Service ────────────────────────────────────────────────────────────

export const taskService = {
  getTasks: async (): Promise<Task[]> => apiFetch('/api/tasks'),
  getTaskById: async (id: string): Promise<Task | undefined> => apiFetch(`/api/tasks/${id}`).catch(() => undefined),

  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const created = await apiFetch<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    await store.hydrate();
    return created;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const updated = await apiFetch<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await store.hydrate();
    return updated;
  },

  toggleTask: async (id: string): Promise<Task> => {
    const toggled = await apiFetch<Task>(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
    await store.hydrate();
    return toggled;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
    await store.hydrate();
  },
};

// ─── Project Service ──────────────────────────────────────────────────────────

export const projectService = {
  getProjects: async (): Promise<Project[]> => apiFetch('/api/projects'),
  getProjectById: async (id: string): Promise<Project | undefined> => apiFetch<Project>(`/api/projects/${id}`).catch(() => undefined),

  createProject: async (project: Omit<Project, 'id' | 'tasksCount' | 'completedTasksCount' | 'progress'>): Promise<Project> => {
    const created = await apiFetch<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
    await store.hydrate();
    return created;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const updated = await apiFetch<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await store.hydrate();
    return updated;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
    await store.hydrate();
  },
};

// ─── Goal Service ─────────────────────────────────────────────────────────────

export const goalService = {
  getGoals: async (): Promise<Goal[]> => apiFetch('/api/goals'),
  getGoalById: async (id: string): Promise<Goal | undefined> => apiFetch<Goal>(`/api/goals/${id}`).catch(() => undefined),

  createGoal: async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
    const created = await apiFetch<Goal>('/api/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
    await store.hydrate();
    return created;
  },

  updateGoal: async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    const updated = await apiFetch<Goal>(`/api/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await store.hydrate();
    return updated;
  },

  toggleMilestone: async (goalId: string, milestoneId: string): Promise<Goal> => {
    const updated = await apiFetch<Goal>(`/api/goals/${goalId}/milestones/${milestoneId}`, { method: 'PATCH' });
    await store.hydrate();
    return updated;
  },
};

// ─── Habit Service ────────────────────────────────────────────────────────────

export const habitService = {
  getHabits: async (): Promise<Habit[]> => apiFetch('/api/habits'),

  createHabit: async (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'totalCompletions' | 'completionHistory'>): Promise<Habit> => {
    const created = await apiFetch<Habit>('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
    await store.hydrate();
    return created;
  },

  updateHabit: async (id: string, updates: Partial<Habit>): Promise<Habit> => {
    const updated = await apiFetch<Habit>(`/api/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await store.hydrate();
    return updated;
  },

  toggleHabitDate: async (habitId: string, dateStr: string): Promise<Habit> => {
    const updated = await apiFetch<Habit>(`/api/habits/${habitId}/toggle-date`, {
      method: 'PATCH',
      body: JSON.stringify({ dateStr }),
    });
    await store.hydrate();
    return updated;
  },
};

// ─── Note Service ─────────────────────────────────────────────────────────────

export const noteService = {
  getNotes: async (): Promise<Note[]> => apiFetch('/api/notes'),
  getNoteById: async (id: string): Promise<Note | undefined> => apiFetch<Note>(`/api/notes/${id}`).catch(() => undefined),

  createNote: async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    const created = await apiFetch<Note>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    await store.hydrate();
    return created;
  },

  updateNote: async (id: string, updates: Partial<Note>): Promise<Note> => {
    const updated = await apiFetch<Note>(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await store.hydrate();
    return updated;
  },

  deleteNote: async (id: string): Promise<void> => {
    await apiFetch(`/api/notes/${id}`, { method: 'DELETE' });
    await store.hydrate();
  },
};

// ─── Memory Service ───────────────────────────────────────────────────────────

export const memoryService = {
  getMemories: async (): Promise<Memory[]> => apiFetch('/api/memories'),

  createMemory: async (memory: Omit<Memory, 'id'>): Promise<Memory> => {
    const created = await apiFetch<Memory>('/api/memories', {
      method: 'POST',
      body: JSON.stringify(memory),
    });
    await store.hydrate();
    return created;
  },

  updateMemory: async (id: string, updates: Partial<Memory>): Promise<Memory> => {
    const updated = await apiFetch<Memory>(`/api/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await store.hydrate();
    return updated;
  },

  deleteMemory: async (id: string): Promise<void> => {
    await apiFetch(`/api/memories/${id}`, { method: 'DELETE' });
    await store.hydrate();
  },
};

// ─── Calendar Service ─────────────────────────────────────────────────────────

export const calendarService = {
  getEvents: async (): Promise<CalendarEvent[]> => apiFetch('/api/calendar'),

  createEvent: async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    const created = await apiFetch<CalendarEvent>('/api/calendar', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    await store.hydrate();
    return created;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiFetch(`/api/calendar/${id}`, { method: 'DELETE' });
    await store.hydrate();
  },
};

// ─── Expense Service ──────────────────────────────────────────────────────────

export const expenseService = {
  getExpenses: async (): Promise<Expense[]> => apiFetch('/api/expenses'),

  createExpense: async (exp: Omit<Expense, 'id'>): Promise<Expense> => {
    const created = await apiFetch<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(exp),
    });
    await store.hydrate();
    return created;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
    await store.hydrate();
  },
};

// ─── Page & Workspace Service ─────────────────────────────────────────────────

export const pageService = {
  getPages: async (): Promise<WorkspacePage[]> => apiFetch('/api/pages'),
  getPageById: async (id: string): Promise<WorkspacePage | undefined> => apiFetch<WorkspacePage>(`/api/pages/${id}`).catch(() => undefined),

  createPage: async (page: Omit<WorkspacePage, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkspacePage> => {
    const created = await apiFetch<WorkspacePage>('/api/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
    await store.hydrate();
    return created;
  },

  updatePage: async (id: string, updates: Partial<WorkspacePage>): Promise<WorkspacePage> => {
    const updated = await apiFetch<WorkspacePage>(`/api/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await store.hydrate();
    return updated;
  },

  deletePage: async (id: string): Promise<void> => {
    await apiFetch(`/api/pages/${id}`, { method: 'DELETE' });
    await store.hydrate();
  },
};

// ─── Database Service ─────────────────────────────────────────────────────────

export const databaseService = {
  getDatabases: async (): Promise<Database[]> => apiFetch('/api/databases'),
  getDatabaseById: async (id: string): Promise<Database | undefined> => apiFetch<Database>(`/api/databases/${id}`).catch(() => undefined),

  addRow: async (databaseId: string, row: any): Promise<Database> => {
    const updated = await apiFetch<Database>(`/api/databases/${databaseId}/rows`, {
      method: 'POST',
      body: JSON.stringify(row),
    });
    await store.hydrate();
    return updated;
  },
};

// ─── AI Service ───────────────────────────────────────────────────────────────

export const aiService = {
  getInsights: async (): Promise<AIInsight[]> => apiFetch('/api/ai/insights'),
  getMessages: async (): Promise<ChatMessage[]> => apiFetch('/api/ai/messages'),

  sendMessage: async (userText: string): Promise<{ userMsg: ChatMessage; aiMsg: ChatMessage }> => {
    const result = await apiFetch<{ userMsg: ChatMessage; aiMsg: ChatMessage }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ text: userText }),
    });
    await store.hydrate();
    return result;
  },

  parseNaturalLanguageQuickAdd: async (input: string) => {
    return apiFetch<any[]>('/api/ai/parse', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
  },
};

// ─── Notification Service ─────────────────────────────────────────────────────

export const notificationService = {
  getNotifications: async (): Promise<AppNotification[]> => apiFetch('/api/notifications'),

  markRead: async (id: string): Promise<AppNotification[]> =>
    apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' }),

  markAllRead: async (): Promise<AppNotification[]> =>
    apiFetch('/api/notifications/read-all', { method: 'PATCH' }),
};
