import {
  mockTasks, mockProjects, mockGoals, mockHabits, mockNotes,
  mockMemories, mockCalendarEvents, mockExpenses, mockPages,
  mockDatabases, mockInsights, mockNotifications, mockInitialChat
} from '../../src/data/mockData';

import {
  Task, Project, Goal, Habit, Note, Memory, CalendarEvent,
  Expense, WorkspacePage, Database, AIInsight, AppNotification,
  ChatMessage
} from '../../src/types';

// Server-side State Store (Firebase-ready abstraction layer)
class ServerStore {
  tasks: Task[] = JSON.parse(JSON.stringify(mockTasks));
  projects: Project[] = JSON.parse(JSON.stringify(mockProjects));
  goals: Goal[] = JSON.parse(JSON.stringify(mockGoals));
  habits: Habit[] = JSON.parse(JSON.stringify(mockHabits));
  notes: Note[] = JSON.parse(JSON.stringify(mockNotes));
  memories: Memory[] = JSON.parse(JSON.stringify(mockMemories));
  calendarEvents: CalendarEvent[] = JSON.parse(JSON.stringify(mockCalendarEvents));
  expenses: Expense[] = JSON.parse(JSON.stringify(mockExpenses));
  pages: WorkspacePage[] = JSON.parse(JSON.stringify(mockPages));
  databases: Database[] = JSON.parse(JSON.stringify(mockDatabases));
  insights: AIInsight[] = JSON.parse(JSON.stringify(mockInsights));
  notifications: AppNotification[] = JSON.parse(JSON.stringify(mockNotifications));
  chatMessages: ChatMessage[] = JSON.parse(JSON.stringify(mockInitialChat));

  // --- Tasks ---
  getTasks = () => this.tasks;
  getTaskById = (id: string) => this.tasks.find(t => t.id === id);
  createTask = (task: Omit<Task, 'id'>): Task => {
    const newTask: Task = { ...task, id: `task-${Date.now()}` };
    this.tasks = [newTask, ...this.tasks];
    return newTask;
  };
  updateTask = (id: string, updates: Partial<Task>): Task => {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    this.tasks[idx] = { ...this.tasks[idx], ...updates };
    return this.tasks[idx];
  };
  deleteTask = (id: string): void => {
    this.tasks = this.tasks.filter(t => t.id !== id);
  };
  toggleTask = (id: string): Task => {
    const task = this.getTaskById(id);
    if (!task) throw new Error('Task not found');
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    return this.updateTask(id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
    });
  };

  // --- Projects ---
  getProjects = () => this.projects;
  getProjectById = (id: string) => this.projects.find(p => p.id === id);
  createProject = (project: Omit<Project, 'id' | 'tasksCount' | 'completedTasksCount' | 'progress'>): Project => {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      progress: 0,
      tasksCount: 0,
      completedTasksCount: 0
    };
    this.projects = [newProj, ...this.projects];
    return newProj;
  };
  updateProject = (id: string, updates: Partial<Project>): Project => {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Project not found');
    this.projects[idx] = { ...this.projects[idx], ...updates };
    return this.projects[idx];
  };
  deleteProject = (id: string): void => {
    this.projects = this.projects.filter(p => p.id !== id);
  };

  // --- Goals ---
  getGoals = () => this.goals;
  getGoalById = (id: string) => this.goals.find(g => g.id === id);
  createGoal = (goal: Omit<Goal, 'id'>): Goal => {
    const newGoal: Goal = { ...goal, id: `goal-${Date.now()}` };
    this.goals = [newGoal, ...this.goals];
    return newGoal;
  };
  updateGoal = (id: string, updates: Partial<Goal>): Goal => {
    const idx = this.goals.findIndex(g => g.id === id);
    if (idx === -1) throw new Error('Goal not found');
    this.goals[idx] = { ...this.goals[idx], ...updates };
    return this.goals[idx];
  };
  deleteGoal = (id: string): void => {
    this.goals = this.goals.filter(g => g.id !== id);
  };
  toggleMilestone = (goalId: string, milestoneId: string): Goal => {
    const goal = this.getGoalById(goalId);
    if (!goal) throw new Error('Goal not found');
    const updatedMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);
    return this.updateGoal(goalId, {
      milestones: updatedMilestones,
      progress
    });
  };

  // --- Habits ---
  getHabits = () => this.habits;
  getHabitById = (id: string) => this.habits.find(h => h.id === id);
  createHabit = (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'totalCompletions' | 'completionHistory'>): Habit => {
    const newHabit: Habit = {
      ...habit,
      id: `habit-${Date.now()}`,
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionHistory: {}
    };
    this.habits = [newHabit, ...this.habits];
    return newHabit;
  };
  updateHabit = (id: string, updates: Partial<Habit>): Habit => {
    const idx = this.habits.findIndex(h => h.id === id);
    if (idx === -1) throw new Error('Habit not found');
    this.habits[idx] = { ...this.habits[idx], ...updates };
    return this.habits[idx];
  };
  deleteHabit = (id: string): void => {
    this.habits = this.habits.filter(h => h.id !== id);
  };
  toggleHabitDate = (habitId: string, dateStr: string): Habit => {
    const habit = this.getHabitById(habitId);
    if (!habit) throw new Error('Habit not found');
    const currentlyDone = !!habit.completionHistory[dateStr];
    const newHistory = { ...habit.completionHistory, [dateStr]: !currentlyDone };
    const newStreak = !currentlyDone ? habit.streak + 1 : Math.max(0, habit.streak - 1);
    const totalCompletions = !currentlyDone ? habit.totalCompletions + 1 : Math.max(0, habit.totalCompletions - 1);

    return this.updateHabit(habitId, {
      completionHistory: newHistory,
      streak: newStreak,
      totalCompletions
    });
  };

  // --- Notes ---
  getNotes = () => this.notes;
  getNoteById = (id: string) => this.notes.find(n => n.id === id);
  createNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    this.notes = [newNote, ...this.notes];
    return newNote;
  };
  updateNote = (id: string, updates: Partial<Note>): Note => {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Note not found');
    const now = new Date().toISOString();
    this.notes[idx] = { ...this.notes[idx], ...updates, updatedAt: now };
    return this.notes[idx];
  };
  deleteNote = (id: string): void => {
    this.notes = this.notes.filter(n => n.id !== id);
  };

  // --- Memories ---
  getMemories = () => this.memories;
  createMemory = (memory: Omit<Memory, 'id'>): Memory => {
    const newMemory: Memory = { ...memory, id: `mem-${Date.now()}` };
    this.memories = [newMemory, ...this.memories];
    return newMemory;
  };
  updateMemory = (id: string, updates: Partial<Memory>): Memory => {
    const idx = this.memories.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Memory not found');
    this.memories[idx] = { ...this.memories[idx], ...updates };
    return this.memories[idx];
  };
  deleteMemory = (id: string): void => {
    this.memories = this.memories.filter(m => m.id !== id);
  };

  // --- Calendar ---
  getEvents = () => this.calendarEvents;
  createEvent = (event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = { ...event, id: `cal-${Date.now()}` };
    this.calendarEvents = [...this.calendarEvents, newEvent];
    return newEvent;
  };
  deleteEvent = (id: string): void => {
    this.calendarEvents = this.calendarEvents.filter(e => e.id !== id);
  };

  // --- Expenses ---
  getExpenses = () => this.expenses;
  createExpense = (exp: Omit<Expense, 'id'>): Expense => {
    const newExp: Expense = { ...exp, id: `exp-${Date.now()}` };
    this.expenses = [newExp, ...this.expenses];
    return newExp;
  };
  deleteExpense = (id: string): void => {
    this.expenses = this.expenses.filter(e => e.id !== id);
  };

  // --- Workspace Pages ---
  getPages = () => this.pages;
  getPageById = (id: string) => this.pages.find(p => p.id === id);
  createPage = (page: Omit<WorkspacePage, 'id' | 'createdAt' | 'updatedAt'>): WorkspacePage => {
    const now = new Date().toISOString();
    const newPage: WorkspacePage = {
      ...page,
      id: `page-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    this.pages = [...this.pages, newPage];
    return newPage;
  };
  updatePage = (id: string, updates: Partial<WorkspacePage>): WorkspacePage => {
    const idx = this.pages.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Page not found');
    const now = new Date().toISOString();
    this.pages[idx] = { ...this.pages[idx], ...updates, updatedAt: now };
    return this.pages[idx];
  };
  deletePage = (id: string): void => {
    this.pages = this.pages.filter(p => p.id !== id);
  };

  // --- Databases ---
  getDatabases = () => this.databases;
  getDatabaseById = (id: string) => this.databases.find(d => d.id === id);
  addRow = (databaseId: string, row: any): Database => {
    const db = this.getDatabaseById(databaseId);
    if (!db) throw new Error('Database not found');
    const newRow = { ...row, id: `row-${Date.now()}` };
    db.rows = [newRow, ...db.rows];
    return db;
  };

  // --- AI Insights & Messages ---
  getInsights = () => this.insights;
  getMessages = () => this.chatMessages;
  sendMessage = (userText: string, customAiText?: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: now
    };

    let replyText = customAiText || "I've analyzed your request and cross-referenced your active goals and calendar.";
    let cards: ChatMessage['cards'] = undefined;
    let references: ChatMessage['references'] = undefined;

    if (!customAiText) {

    const lower = userText.toLowerCase();
    if (lower.includes('plan') || lower.includes('day') || lower.includes('morning')) {
      replyText = "Here is an optimized daily plan based on your peak cognitive hours and pending deadlines:";
      cards = [
        {
          title: 'Optimized Day Plan',
          items: [
            '08:30 - 10:30: Deep Work: Spring Boot REST & JPA (Peak Flow)',
            '11:00 - 11:45: Screening Interview @ TechCorp',
            '14:30 - 15:30: Recruiter Follow-ups (Low Energy Window)',
            '18:30 - 19:30: 8km Marathon Tempo Run'
          ],
          actionLabel: 'Add to Schedule',
          actionType: 'APPLY_SCHEDULE'
        }
      ];
      references = [
        { type: 'project', title: 'Career Development', id: 'proj-1' },
        { type: 'task', title: 'Learn Spring Boot', id: 'task-1' }
      ];
    } else if (lower.includes('forget') || lower.includes('miss') || lower.includes('behind')) {
      replyText = "Checking your commitments... You have 2 items needing attention:";
      cards = [
        {
          title: 'Items Needing Attention',
          items: [
            '⚠️ Follow up with HR at Stripe & Google (Due today)',
            '⚠️ Marathon training is 18% behind weekly volume target'
          ],
          actionLabel: 'Schedule Now',
          actionType: 'RESOLVE_ALERTS'
        }
      ];
    } else if (lower.includes('retreat') || lower.includes('organize') || lower.includes('framework')) {
      replyText = "I've synthesized a structured execution framework based on your notes:";
      cards = [
        {
          title: 'Team Strategy Framework',
          items: [
            '1. Objectives & Key Results (H2 alignment)',
            '2. Team Workshop Agenda & Facilitation',
            '3. Logistics, Venue & Asynchronous Pre-reading'
          ],
          actionLabel: 'Create Workspace Page',
          actionType: 'CREATE_PAGE'
        }
      ];
    } else {
      replyText = `Understood! I've connected this with your Career Development project and saved relevant preferences to your memory bank.`;
    }
    }

    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ai',
      text: replyText,
      timestamp: now,
      cards,
      references
    };

    this.chatMessages = [...this.chatMessages, userMsg, aiMsg];
    return { userMsg, aiMsg };
  };

  parseNaturalLanguage = (input: string) => {
    return [
      { type: 'TASK', title: 'Call HR and discuss offer terms', project: 'Career Development', priority: 'high' },
      { type: 'TASK', title: 'Send updated portfolio and GitHub links', project: 'Career Development', priority: 'medium' },
      { type: 'REMINDER', title: 'Follow-up notification', time: 'Tomorrow · 9:00 AM' },
      { type: 'CATEGORY', title: 'Career' }
    ];
  };

  // --- Notifications ---
  getNotifications = () => this.notifications;
  markNotificationRead = (id: string) => {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    return this.notifications;
  };
  markAllNotificationsRead = () => {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    return this.notifications;
  };

  // --- Full State Sync ---
  getFullState = () => ({
    tasks: this.tasks,
    projects: this.projects,
    goals: this.goals,
    habits: this.habits,
    notes: this.notes,
    memories: this.memories,
    calendarEvents: this.calendarEvents,
    expenses: this.expenses,
    pages: this.pages,
    databases: this.databases,
    insights: this.insights,
    notifications: this.notifications,
    chatMessages: this.chatMessages
  });
}

export const serverStore = new ServerStore();
