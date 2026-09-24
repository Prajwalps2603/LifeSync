export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'waiting' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string; // ISO or YYYY-MM-DD
  dueTime?: string;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  tags: string[];
  reminder?: string;
  completedAt?: string;
  subtasks?: Subtask[];
  estimatedMinutes?: number;
  energyLevel?: 'low' | 'medium' | 'high';
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed';

export interface ProjectActivity {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number; // 0 to 100
  deadline: string;
  category: 'Career' | 'Personal' | 'Development' | 'Finance' | 'Creative';
  color: string;
  icon: string;
  tasksCount: number;
  completedTasksCount: number;
  recentActivity?: ProjectActivity[];
  aiRecommendation?: string;
  goalId?: string;
  goalName?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Goal {
  id: string;
  name: string;
  category: 'Career' | 'Health' | 'Finance' | 'Learning' | 'Personal';
  progress: number; // percentage
  target: number;
  current: number;
  unit: string;
  deadline: string;
  milestones: Milestone[];
  streak: number; // in weeks or days
  status: 'active' | 'completed' | 'behind' | 'paused';
  timeframe: 'quarterly' | 'yearly' | 'long_term';
  aiInsight?: string;
  color?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: 'Health' | 'Mindset' | 'Productivity' | 'Learning' | 'Creativity';
  icon: string;
  color: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  streak: number; // current streak in days
  longestStreak: number;
  totalCompletions: number;
  // History is a map of date string YYYY-MM-DD -> boolean
  completionHistory: Record<string, boolean>;
  reminderTime?: string;
  aiInsight?: string;
  targetPerWeek: number;
}

export interface Note {
  id: string;
  title: string;
  preview: string;
  content: string; // rich markdown / block representation
  category: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isFavorite?: boolean;
  updatedAt: string;
  createdAt: string;
  relatedProjectIds?: string[];
  relatedTaskIds?: string[];
  aiSummary?: string;
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  category: 'Personal' | 'Work' | 'Learning' | 'Preferences' | 'Decisions' | 'Important Dates' | 'People' | 'Projects';
  date: string;
  importance: 'low' | 'medium' | 'high';
  source: string;
  isPinned?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'event' | 'task' | 'focus' | 'habit' | 'reminder';
  start: string; // ISO or YYYY-MM-DDTHH:mm:ss
  end: string;   // ISO or YYYY-MM-DDTHH:mm:ss
  allDay?: boolean;
  color?: string;
  location?: string;
  description?: string;
  relatedProjectId?: string;
  relatedTaskId?: string;
  category?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Education' | 'Entertainment' | 'Health' | 'Income' | 'Other';
  date: string;
  account: string;
  notes?: string;
  recurring?: boolean;
}

export type BlockType = 
  | 'text' 
  | 'heading_1' 
  | 'heading_2' 
  | 'heading_3' 
  | 'todo' 
  | 'bullet_list' 
  | 'numbered_list' 
  | 'toggle' 
  | 'quote' 
  | 'callout' 
  | 'divider' 
  | 'image' 
  | 'code' 
  | 'table' 
  | 'database' 
  | 'ai';

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  isOpen?: boolean;
  language?: string;
  calloutType?: 'info' | 'idea' | 'warning' | 'ai';
  properties?: Record<string, any>;
  children?: EditorBlock[];
}

export interface WorkspacePage {
  id: string;
  title: string;
  icon: string;
  cover?: string;
  parentId?: string | null;
  isFavorite?: boolean;
  isArchived?: boolean;
  updatedAt: string;
  createdAt: string;
  category: string;
  blocks: EditorBlock[];
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multi_select' | 'status' | 'date' | 'relation';
  options?: { id: string; label: string; color: string }[];
}

export interface DatabaseRow {
  id: string;
  [propertyId: string]: any;
}

export interface DatabaseView {
  id: string;
  name: string;
  type: 'table' | 'board' | 'calendar' | 'list' | 'timeline';
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Database {
  id: string;
  name: string;
  icon: string;
  description: string;
  properties: DatabaseProperty[];
  rows: DatabaseRow[];
  views: DatabaseView[];
}


export interface AIInsight {
  id: string;
  title: string;
  message: string;
  category: 'Daily Plan' | 'Productivity' | 'Goal' | 'Habit' | 'Finance' | 'Wellbeing';
  type: 'clarity' | 'proactive' | 'observation' | 'suggestion';
  timestamp: string;
  actionLabel?: string;
  actionType?: string;
  actionPayload?: any;
  dismissed?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ai' | 'reminder' | 'task' | 'goal';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  cards?: {
    title: string;
    items?: string[];
    actionLabel?: string;
    actionType?: string;
  }[];
  references?: {
    type: 'page' | 'task' | 'project' | 'note' | 'goal' | 'memory';
    title: string;
    id: string;
  }[];
}
