import {
  Task, Project, Goal, Habit, Note, Memory, CalendarEvent,
  Expense, WorkspacePage, Database, AIInsight, AppNotification,
  ChatMessage
} from '../types';

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Learn Spring Boot REST Architecture & JPA',
    description: 'Complete modules 3 & 4 covering Entity relations and Spring Security JWT.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-08-30',
    dueTime: '11:00',
    projectId: 'proj-1',
    projectName: 'Career Development',
    projectColor: '#4343D5',
    tags: ['Backend', 'Study', 'Spring'],
    estimatedMinutes: 90,
    energyLevel: 'high',
    subtasks: [
      { id: 'sub-1', title: 'Repository & Service Layer Pattern', completed: true },
      { id: 'sub-2', title: 'JWT Authentication Filter', completed: true },
      { id: 'sub-3', title: 'Controller exception handlers', completed: false },
    ]
  },
  {
    id: 'task-2',
    title: 'Follow up with HR at Stripe & Google',
    description: 'Send polite follow-up email with updated portfolio link.',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-08-30',
    dueTime: '14:30',
    projectId: 'proj-1',
    projectName: 'Career Development',
    projectColor: '#4343D5',
    tags: ['Job Search', 'Outreach'],
    reminder: '10 minutes before',
    estimatedMinutes: 20,
    energyLevel: 'medium'
  },
  {
    id: 'task-3',
    title: 'Update Portfolio case study for LifeSync',
    description: 'Add system architecture diagram and interactive prototype demo video.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-08-31',
    dueTime: '17:00',
    projectId: 'proj-2',
    projectName: 'Portfolio Refresh',
    projectColor: '#D946EF',
    tags: ['Design', 'Showcase'],
    estimatedMinutes: 60,
    energyLevel: 'high'
  },
  {
    id: 'task-4',
    title: 'Prepare Spring Boot Technical Interview questions',
    description: 'Review concurrency, GC tuning, bean lifecycle, and transaction management.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-09-01',
    dueTime: '10:00',
    projectId: 'proj-1',
    projectName: 'Career Development',
    projectColor: '#4343D5',
    tags: ['Interview', 'Study'],
    estimatedMinutes: 45,
    energyLevel: 'high'
  },
  {
    id: 'task-5',
    title: 'Review Monthly Budget & Vanguard Index Fund',
    description: 'Rebalance portfolio and allocate $500 to emergency savings fund.',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-08-28',
    projectId: 'proj-3',
    projectName: 'Personal Finance',
    projectColor: '#0284C7',
    tags: ['Finance', 'Savings'],
    completedAt: '2026-08-28T16:20:00Z',
    estimatedMinutes: 30
  },
  {
    id: 'task-6',
    title: 'Order replacement running shoes (Nike Pegasus)',
    description: 'Current pair hit 500km mark during yesterday training run.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-09-02',
    projectId: 'proj-4',
    projectName: 'Marathon 2026',
    projectColor: '#059669',
    tags: ['Health', 'Gear'],
    estimatedMinutes: 15
  },
  {
    id: 'task-7',
    title: 'Draft proposal for Team Knowledge Base sync',
    description: 'Propose automated sync between Notion workspaces and internal repos.',
    status: 'waiting',
    priority: 'medium',
    dueDate: '2026-09-04',
    projectId: 'proj-2',
    projectName: 'Portfolio Refresh',
    projectColor: '#D946EF',
    tags: ['Work', 'Documentation']
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Career Development',
    description: 'Master full-stack systems, land Senior Engineer role, and build production web applications.',
    status: 'in_progress',
    priority: 'urgent',
    progress: 68,
    deadline: '2026-11-15',
    category: 'Career',
    color: '#4343D5',
    icon: 'Briefcase',
    tasksCount: 14,
    completedTasksCount: 9,
    goalId: 'goal-1',
    goalName: 'Become Full Stack Developer',
    aiRecommendation: 'You are progressing well in Spring Boot. Schedule a mock interview block on Thursday before the Friday recruiter calls.',
    recentActivity: [
      { id: 'act-1', action: 'Completed task "JWT Authentication Filter"', timestamp: '2 hours ago', user: 'You' },
      { id: 'act-2', action: 'Added note "Interview preparation cheat sheet"', timestamp: 'Yesterday', user: 'LifeSync AI' },
      { id: 'act-3', action: 'Logged application for Senior Full Stack Engineer at Stripe', timestamp: '3 days ago', user: 'You' }
    ]
  },
  {
    id: 'proj-2',
    name: 'LifeSync Platform',
    description: 'Design and build the modern AI-assisted personal operating system frontend and architecture.',
    status: 'in_progress',
    priority: 'high',
    progress: 85,
    deadline: '2026-09-30',
    category: 'Development',
    color: '#5D5FEF',
    icon: 'Layers',
    tasksCount: 20,
    completedTasksCount: 17,
    goalId: 'goal-1',
    goalName: 'Become Full Stack Developer',
    aiRecommendation: 'The block editor and life graph visual connections have the highest impact for your demo.',
    recentActivity: [
      { id: 'act-4', action: 'Implemented flexible Database multi-view switchers', timestamp: '1 hour ago', user: 'You' },
      { id: 'act-5', action: 'Refactored CSS design system with Manrope and Inter typography', timestamp: '4 hours ago', user: 'You' }
    ]
  },
  {
    id: 'proj-3',
    name: 'Personal Finance & Wealth',
    description: 'Maintain 6-month runway emergency fund and automated monthly ETF investment contributions.',
    status: 'in_progress',
    priority: 'medium',
    progress: 74,
    deadline: '2026-12-31',
    category: 'Finance',
    color: '#0284C7',
    icon: 'DollarSign',
    tasksCount: 8,
    completedTasksCount: 6,
    goalId: 'goal-3',
    goalName: 'Grow Net Worth & Savings',
    aiRecommendation: 'Dining spending is 12% lower this month, allowing an extra $200 deposit to your high-yield savings account.'
  },
  {
    id: 'proj-4',
    name: 'Marathon 2026',
    description: 'Structured 18-week training program targeting sub 3:45:00 marathon finish time.',
    status: 'in_progress',
    priority: 'medium',
    progress: 42,
    deadline: '2026-10-18',
    category: 'Personal',
    color: '#059669',
    icon: 'Activity',
    tasksCount: 18,
    completedTasksCount: 8,
    goalId: 'goal-2',
    goalName: 'Run Berlin Marathon',
    aiRecommendation: 'You are 2 long runs behind schedule due to rain last weekend. Add a 16km tempo run this Saturday morning.'
  }
];

export const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    name: 'Become Full Stack Developer',
    category: 'Career',
    progress: 68,
    target: 100,
    current: 68,
    unit: '% complete',
    deadline: '2026-11-30',
    streak: 6,
    status: 'active',
    timeframe: 'quarterly',
    color: '#4343D5',
    aiInsight: 'You have completed 9 of 14 tasks in Career Development. Your pace indicates completion 10 days ahead of target.',
    milestones: [
      { id: 'm-1', title: 'Complete Advanced React & State Mastery', completed: true, dueDate: '2026-07-15' },
      { id: 'm-2', title: 'Spring Boot REST & JPA Deep Dive', completed: true, dueDate: '2026-08-25' },
      { id: 'm-3', title: 'Build Full Stack LifeSync Project', completed: false, dueDate: '2026-09-20' },
      { id: 'm-4', title: 'Pass 5 Technical Onsite Interviews', completed: false, dueDate: '2026-11-15' },
    ]
  },
  {
    id: 'goal-2',
    name: 'Run Berlin Marathon',
    category: 'Health',
    progress: 42,
    target: 42.2,
    current: 21.1,
    unit: 'km long run distance',
    deadline: '2026-10-18',
    streak: 3,
    status: 'behind',
    timeframe: 'quarterly',
    color: '#059669',
    aiInsight: 'Current volume is 18% behind schedule. Suggested adjustment: convert Wednesday 5k into 8k interval run.',
    milestones: [
      { id: 'm-5', title: 'Complete 10K base run in under 50 mins', completed: true, dueDate: '2026-06-10' },
      { id: 'm-6', title: 'Complete Half Marathon (21.1 km)', completed: true, dueDate: '2026-07-28' },
      { id: 'm-7', title: '30 km long run milestone', completed: false, dueDate: '2026-09-15' },
      { id: 'm-8', title: 'Race Day Marathon Finish', completed: false, dueDate: '2026-10-18' },
    ]
  },
  {
    id: 'goal-3',
    name: 'Read 24 Non-Fiction Books',
    category: 'Learning',
    progress: 54,
    target: 24,
    current: 13,
    unit: 'books read',
    deadline: '2026-12-31',
    streak: 8,
    status: 'active',
    timeframe: 'yearly',
    color: '#EA580C',
    aiInsight: 'You are on track! Current rate is 1.6 books per month, exactly reaching 24 books by December 22.',
    milestones: [
      { id: 'm-9', title: 'Finish 6 Books in Q1', completed: true, dueDate: '2026-03-31' },
      { id: 'm-10', title: 'Finish 12 Books in Q2', completed: true, dueDate: '2026-06-30' },
      { id: 'm-11', title: 'Finish 18 Books in Q3', completed: false, dueDate: '2026-09-30' },
      { id: 'm-12', title: 'Finish 24 Books in Q4', completed: false, dueDate: '2026-12-31' },
    ]
  },
  {
    id: 'goal-4',
    name: 'Save $20,000 Emergency & Investment Reserve',
    category: 'Finance',
    progress: 75,
    target: 20000,
    current: 15000,
    unit: '$ saved',
    deadline: '2026-12-31',
    streak: 7,
    status: 'active',
    timeframe: 'yearly',
    color: '#0284C7',
    aiInsight: 'Automated transfers are functioning well. You will reach $20,000 by November 15 with current surplus.',
    milestones: [
      { id: 'm-13', title: '$5,000 Milestone', completed: true, dueDate: '2026-03-31' },
      { id: 'm-14', title: '$10,000 Milestone', completed: true, dueDate: '2026-06-30' },
      { id: 'm-15', title: '$15,000 Milestone', completed: true, dueDate: '2026-08-20' },
      { id: 'm-16', title: '$20,000 Final Goal', completed: false, dueDate: '2026-12-31' },
    ]
  }
];

export const mockHabits: Habit[] = [
  {
    id: 'habit-1',
    name: 'Morning Deep Learning Session (45m)',
    category: 'Learning',
    icon: 'BookOpen',
    color: '#4343D5',
    frequency: 'weekdays',
    streak: 14,
    longestStreak: 22,
    totalCompletions: 88,
    targetPerWeek: 5,
    reminderTime: '08:00',
    aiInsight: 'You complete your learning habit most consistently on Monday, Wednesday, and Friday mornings between 8:00 AM and 9:00 AM.',
    completionHistory: {
      '2026-08-30': true,
      '2026-08-29': true,
      '2026-08-28': true,
      '2026-08-27': true,
      '2026-08-26': true,
      '2026-08-25': true,
      '2026-08-24': true,
      '2026-08-23': false,
      '2026-08-22': true,
      '2026-08-21': true,
      '2026-08-20': true,
      '2026-08-19': true,
      '2026-08-18': true,
      '2026-08-17': true
    }
  },
  {
    id: 'habit-2',
    name: 'Mindfulness & Box Breathing (10m)',
    category: 'Mindset',
    icon: 'BrainCircuit',
    color: '#8B5CF6',
    frequency: 'daily',
    streak: 9,
    longestStreak: 30,
    totalCompletions: 112,
    targetPerWeek: 7,
    reminderTime: '07:30',
    aiInsight: 'Meditation before your workday correlates with 24% fewer task reschedules later in the afternoon.',
    completionHistory: {
      '2026-08-30': true,
      '2026-08-29': true,
      '2026-08-28': true,
      '2026-08-27': true,
      '2026-08-26': true,
      '2026-08-25': true,
      '2026-08-24': true,
      '2026-08-23': true,
      '2026-08-22': true,
      '2026-08-21': false,
      '2026-08-20': true,
      '2026-08-19': true
    }
  },
  {
    id: 'habit-3',
    name: 'Read 30 Pages of Book',
    category: 'Productivity',
    icon: 'Bookmark',
    color: '#EA580C',
    frequency: 'daily',
    streak: 6,
    longestStreak: 18,
    totalCompletions: 95,
    targetPerWeek: 7,
    reminderTime: '21:30',
    aiInsight: 'Reading right before bed has improved your recorded sleep quality score by 15%.',
    completionHistory: {
      '2026-08-30': false,
      '2026-08-29': true,
      '2026-08-28': true,
      '2026-08-27': true,
      '2026-08-26': true,
      '2026-08-25': true,
      '2026-08-24': true,
      '2026-08-23': false,
      '2026-08-22': true
    }
  },
  {
    id: 'habit-4',
    name: 'Outdoor Running or Cardio Session',
    category: 'Health',
    icon: 'Heart',
    color: '#059669',
    frequency: 'daily',
    streak: 4,
    longestStreak: 15,
    totalCompletions: 64,
    targetPerWeek: 5,
    reminderTime: '06:45',
    aiInsight: 'Running outdoors boosts your afternoon cognitive focus by 30% according to your daily review notes.',
    completionHistory: {
      '2026-08-30': true,
      '2026-08-29': true,
      '2026-08-28': true,
      '2026-08-27': true,
      '2026-08-26': false,
      '2026-08-25': true,
      '2026-08-24': false
    }
  }
];

export const mockMemories: Memory[] = [
  {
    id: 'mem-1',
    title: 'Morning Coffee Order',
    content: 'Prefers oat milk flat white, strictly no sugar. Usually orders around 9:30 AM before starting deep coding sessions.',
    category: 'Preferences',
    date: '2026-08-15',
    importance: 'medium',
    source: 'Calendar notes & Café receipts',
    isPinned: true
  },
  {
    id: 'mem-2',
    title: 'Peak Cognitive Flow State',
    content: 'User works best on complex algorithmic and architectural problems between 8:00 AM and 11:30 AM with noise-cancelling headphones.',
    category: 'Preferences',
    date: '2026-08-10',
    importance: 'high',
    source: 'Observed activity pattern & Daily Check-in',
    isPinned: true
  },
  {
    id: 'mem-3',
    title: 'Career Salary Target & Preferences',
    content: 'Targeting $150k–$175k base for Senior Full Stack Engineer. Strongly prefers remote-first companies with async communication culture and high engineering bar.',
    category: 'Work',
    date: '2026-08-01',
    importance: 'high',
    source: 'Conversation with AI Companion',
    isPinned: true
  },
  {
    id: 'mem-4',
    title: 'Mom Birthday & Gift Idea',
    content: 'Mom birthday is October 14th. Mentioned she loved ceramic artisanal tea sets from Japan.',
    category: 'Important Dates',
    date: '2026-07-20',
    importance: 'high',
    source: 'Quick note extracted by AI'
  },
  {
    id: 'mem-5',
    title: 'Favorite Running Route',
    content: 'Prefers the 10km Riverside Trail loop with gradual elevation over asphalt road running.',
    category: 'Personal',
    date: '2026-07-12',
    importance: 'low',
    source: 'Marathon training log'
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-101',
    title: 'Sprint Kickoff & Q3 Goals',
    type: 'event',
    start: '2026-08-03T09:30:00',
    end: '2026-08-03T10:30:00',
    color: '#5D5FEF',
    location: 'Google Meet',
    description: 'Alignment on quarterly engineering deliverables.'
  },
  {
    id: 'cal-102',
    title: '5km Morning Recovery Run',
    type: 'habit',
    start: '2026-08-05T07:00:00',
    end: '2026-08-05T07:45:00',
    color: '#059669',
    description: 'Easy aerobic base run.'
  },
  {
    id: 'cal-103',
    title: 'Deep Focus: Database Schema Design',
    type: 'focus',
    start: '2026-08-08T14:00:00',
    end: '2026-08-08T16:30:00',
    color: '#4343D5',
    description: 'PostgreSQL relational indexing and migration planning.'
  },
  {
    id: 'cal-104',
    title: 'Design Critique: UI/UX Flow',
    type: 'event',
    start: '2026-08-12T11:00:00',
    end: '2026-08-12T12:00:00',
    color: '#0284C7',
    location: 'Figma Live',
    description: 'Walkthrough of mobile navigation and widget layout.'
  },
  {
    id: 'cal-105',
    title: '15km Weekend Long Run',
    type: 'habit',
    start: '2026-08-15T06:30:00',
    end: '2026-08-15T08:15:00',
    color: '#059669',
    description: 'Marathon prep with electrolyte pacing.'
  },
  {
    id: 'cal-106',
    title: 'System Architecture Review',
    type: 'task',
    start: '2026-08-18T15:00:00',
    end: '2026-08-18T16:30:00',
    color: '#EA580C',
    description: 'Microservice caching layer evaluation.'
  },
  {
    id: 'cal-107',
    title: 'Deep Focus: JWT Auth & Spring Security',
    type: 'focus',
    start: '2026-08-20T09:00:00',
    end: '2026-08-20T11:30:00',
    color: '#4343D5',
    description: 'Role-based access control and token refresh implementation.'
  },
  {
    id: 'cal-108',
    title: 'Coffee Chat with Principal Architect',
    type: 'event',
    start: '2026-08-22T16:00:00',
    end: '2026-08-22T17:00:00',
    color: '#9333EA',
    location: 'Third Wave Coffee',
    description: 'Mentorship discussion on scalable event-driven systems.'
  },
  {
    id: 'cal-109',
    title: 'Portfolio Case Study Milestone',
    type: 'task',
    start: '2026-08-25T13:00:00',
    end: '2026-08-25T14:30:00',
    color: '#EA580C',
    description: 'Write up architecture deep dive for recruiter portfolio.'
  },
  {
    id: 'cal-110',
    title: '10km Interval Track Workout',
    type: 'habit',
    start: '2026-08-28T07:00:00',
    end: '2026-08-28T08:00:00',
    color: '#059669',
    description: '6x 800m repeats at 4:30 pace.'
  },
  // Today: Aug 30, 2026
  {
    id: 'cal-1',
    title: 'Morning Focus: Spring Boot Deep Dive',
    type: 'focus',
    start: '2026-08-30T08:30:00',
    end: '2026-08-30T10:30:00',
    color: '#4343D5',
    description: 'High cognitive energy window for mastering JPA & JWT architecture.'
  },
  {
    id: 'cal-2',
    title: 'Tech Lead Screening Interview @ TechCorp',
    type: 'event',
    start: '2026-08-30T11:00:00',
    end: '2026-08-30T11:45:00',
    color: '#5D5FEF',
    location: 'Google Meet',
    description: 'Screening call with Senior Engineering Manager. Review distributed systems & Spring experience.'
  },
  {
    id: 'cal-3',
    title: 'Lunch & 20m Nature Walk',
    type: 'habit',
    start: '2026-08-30T12:30:00',
    end: '2026-08-30T13:15:00',
    color: '#059669',
    description: 'Recharge mental bandwidth before afternoon execution block.'
  },
  {
    id: 'cal-4',
    title: 'Follow-up Email Outreach to HR & Recruiters',
    type: 'task',
    start: '2026-08-30T14:30:00',
    end: '2026-08-30T15:15:00',
    color: '#EA580C',
    description: 'Batch process outbound application status inquiries.'
  },
  {
    id: 'cal-5',
    title: 'LifeSync Design System Review & Testing',
    type: 'task',
    start: '2026-08-30T16:00:00',
    end: '2026-08-30T17:30:00',
    color: '#4343D5',
    description: 'Verify responsive navigation and test block editor interactions.'
  },
  {
    id: 'cal-6',
    title: 'Evening 8km Marathon Tempo Run',
    type: 'habit',
    start: '2026-08-30T18:30:00',
    end: '2026-08-30T19:30:00',
    color: '#059669',
    description: 'Target 5:15 min/km pace on Riverside loop.'
  },
  // Upcoming events
  {
    id: 'cal-7',
    title: 'System Design Mock Interview',
    type: 'event',
    start: '2026-09-01T10:00:00',
    end: '2026-09-01T11:00:00',
    color: '#5D5FEF',
    location: 'Zoom'
  },
  {
    id: 'cal-8',
    title: 'Monthly Financial Review & Allocation',
    type: 'task',
    start: '2026-09-02T16:00:00',
    end: '2026-09-02T17:00:00',
    color: '#0284C7'
  },
  {
    id: 'cal-9',
    title: '21km Half Marathon Benchmark',
    type: 'habit',
    start: '2026-09-06T06:00:00',
    end: '2026-09-06T08:30:00',
    color: '#059669',
    description: 'Race pace simulation along coastline.'
  }
];


export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Spring Boot Interview Preparation Cheat Sheet',
    preview: 'Key concepts: DispatcherServlet, Bean scopes (singleton, prototype), Spring Security filters, and @Transactional isolation levels...',
    content: `# Spring Boot Technical Interview Notes

## 1. Core Architecture
- **DispatcherServlet**: Front controller pattern handling incoming HTTP requests.
- **IoC Container**: Manages bean lifecycle, dependency injection (@Autowired, constructor injection).
- **Bean Scopes**: Singleton (default), Prototype, Request, Session, Application.

## 2. Spring Security & JWT
- SecurityFilterChain configuration.
- OncePerRequestFilter for validating Bearer tokens.
- AuthenticationManager & UserDetailsService contract.

## 3. Database & JPA Performance
- N+1 problem solutions: \`JOIN FETCH\`, \`@EntityGraph\`, and DTO projections.
- Transaction isolation levels: READ_COMMITTED vs REPEATABLE_READ.`,
    category: 'Career',
    tags: ['Interview', 'Spring', 'Architecture'],
    isPinned: true,
    isArchived: false,
    updatedAt: '2026-08-29T18:40:00',
    createdAt: '2026-08-20T10:00:00',
    relatedProjectIds: ['proj-1'],
    relatedTaskIds: ['task-1', 'task-4'],
    aiSummary: 'Comprehensive reference covering Spring MVC lifecycle, security filters, and JPA query optimization.'
  },
  {
    id: 'note-2',
    title: 'LifeSync Product Vision & Architecture Spec',
    preview: 'A unified personal AI operating system combining Notion-style flexible workspaces with proactive semantic relationship intelligence...',
    content: `# LifeSync Product Spec & Architecture

> "Your life, organized. Your decisions, easier."

### Core Philosophy
1. Everything is connected (Goals → Projects → Tasks → Notes → Calendar → Memories → AI Insights).
2. Proactive AI that surfaces relevant context before you ask.
3. Digital Zen aesthetic: Warm off-white surfaces, deep indigo accents, ambient shadows.`,
    category: 'Development',
    tags: ['Architecture', 'Product', 'Design'],
    isPinned: true,
    isArchived: false,
    updatedAt: '2026-08-30T12:00:00',
    createdAt: '2026-08-28T09:00:00',
    relatedProjectIds: ['proj-2']
  },
  {
    id: 'note-3',
    title: 'Atomic Habits Summary & Implementation System',
    preview: 'The 4 Laws of Behavior Change: Make it Obvious, Make it Attractive, Make it Easy, Make it Satisfying. Identity-based habits...',
    content: `# Atomic Habits by James Clear

### The 4 Laws:
1. **Cue**: Make it obvious (Environment design).
2. **Craving**: Make it attractive (Temptation bundling).
3. **Response**: Make it easy (2-minute rule, reduce friction).
4. **Reward**: Make it satisfying (Immediate reinforcement).`,
    category: 'Learning',
    tags: ['Books', 'Habits', 'Mindset'],
    isPinned: false,
    isArchived: false,
    updatedAt: '2026-08-25T14:30:00',
    createdAt: '2026-08-15T11:00:00'
  },
  {
    id: 'note-4',
    title: 'Marathon Nutrition & Pacing Strategy',
    preview: 'Carb loading plan 3 days prior (7-8g carb/kg). On race day: 1 gel every 30 minutes with water. Target heart rate zone 3...',
    content: `# Marathon Nutrition & Pacing Strategy

- **Target Pace**: 5:18 min/km for a 3:44:00 finish.
- **Hydration**: 150ml water at every 5km aid station.
- **Gels**: Maurten Gel 100 at km 7, 14, 21, 28, 35.`,
    category: 'Personal',
    tags: ['Marathon', 'Nutrition', 'Health'],
    isPinned: false,
    isArchived: false,
    updatedAt: '2026-08-22T08:15:00',
    createdAt: '2026-08-10T15:00:00',
    relatedProjectIds: ['proj-4']
  }
];

export const mockExpenses: Expense[] = [
  { id: 'exp-1', title: 'Monthly Salary - Engineering', amount: 8500, type: 'income', category: 'Income', date: '2026-08-01', account: 'Chase Checking' },
  { id: 'exp-2', title: 'Apartment Rent & Utilities', amount: 2150, type: 'expense', category: 'Bills', date: '2026-08-02', account: 'Chase Checking', recurring: true },
  { id: 'exp-3', title: 'Whole Foods Groceries', amount: 165.40, type: 'expense', category: 'Food', date: '2026-08-28', account: 'Amex Gold' },
  { id: 'exp-4', title: 'Oat Milk Flat White & Café', amount: 6.50, type: 'expense', category: 'Food', date: '2026-08-30', account: 'Apple Pay' },
  { id: 'exp-5', title: 'AWS Cloud & Development Hosting', amount: 48.20, type: 'expense', category: 'Education', date: '2026-08-15', account: 'Chase Sapphire' },
  { id: 'exp-6', title: 'Nike Running Shoes (Marathon)', amount: 160.00, type: 'expense', category: 'Health', date: '2026-08-20', account: 'Amex Gold' },
  { id: 'exp-7', title: 'Vanguard Total Stock ETF (VTI)', amount: 1200, type: 'expense', category: 'Other', date: '2026-08-05', account: 'Vanguard Brokerage', recurring: true },
  { id: 'exp-8', title: 'Spotify & OpenAI Subscriptions', amount: 35.00, type: 'expense', category: 'Bills', date: '2026-08-12', account: 'Apple Pay', recurring: true },
  { id: 'exp-9', title: 'Dining with Tech Mentors', amount: 85.00, type: 'expense', category: 'Food', date: '2026-08-24', account: 'Amex Gold' }
];

export const mockPages: WorkspacePage[] = [
  {
    id: 'page-career',
    title: 'Career & Professional Growth',
    icon: '🚀',
    cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    parentId: null,
    isFavorite: true,
    category: 'Career',
    updatedAt: '2026-08-30T10:00:00',
    createdAt: '2026-08-01T09:00:00',
    blocks: [
      { id: 'b-1', type: 'heading_1', content: 'Career Strategy & Job Search' },
      {
        id: 'b-2',
        type: 'callout',
        content: 'AI Insight: You have 4 active job applications. 2 require follow-up emails this week.',
        calloutType: 'ai'
      },
      { id: 'b-3', type: 'heading_2', content: 'Priority Action Items' },
      { id: 'b-4', type: 'todo', content: 'Submit updated resume for Java Full Stack position at Stripe', checked: true },
      { id: 'b-5', type: 'todo', content: 'Schedule system design mock interview with mentor', checked: false },
      { id: 'b-6', type: 'todo', content: 'Complete Spring Boot REST and JPA microservice project', checked: false },
      { id: 'b-7', type: 'divider', content: '' },
      { id: 'b-8', type: 'heading_2', content: 'Key Reference Notes' },
      { id: 'b-9', type: 'bullet_list', content: 'Spring Boot Interview Preparation Cheat Sheet' },
      { id: 'b-10', type: 'bullet_list', content: 'System Architecture & Scalability Patterns' },
      { id: 'b-11', type: 'bullet_list', content: 'Questions to Ask Hiring Managers & Tech Leads' }
    ]
  },
  {
    id: 'page-learning',
    title: 'Learning Roadmap & Skill Tree',
    icon: '📚',
    parentId: 'page-career',
    isFavorite: false,
    category: 'Career',
    updatedAt: '2026-08-28T16:00:00',
    createdAt: '2026-08-05T10:00:00',
    blocks: [
      { id: 'b-12', type: 'heading_1', content: '2026 Engineering Skill Tree' },
      { id: 'b-13', type: 'quote', content: 'Live as if you were to die tomorrow. Learn as if you were to live forever. — Mahatma Gandhi' },
      { id: 'b-14', type: 'heading_2', content: 'Core Milestones' },
      { id: 'b-15', type: 'todo', content: 'Spring Boot 3.x + Spring Security 6', checked: true },
      { id: 'b-16', type: 'todo', content: 'PostgreSQL Advanced Indexing & Query Tuning', checked: false },
      { id: 'b-17', type: 'todo', content: 'Redis Caching & Pub/Sub Patterns', checked: false },
      { id: 'b-18', type: 'todo', content: 'Docker, Kubernetes & CI/CD Pipelines', checked: false }
    ]
  },
  {
    id: 'page-personal',
    title: 'Personal HQ & Lifestyle',
    icon: '🌿',
    parentId: null,
    isFavorite: true,
    category: 'Personal',
    updatedAt: '2026-08-27T11:00:00',
    createdAt: '2026-08-01T09:00:00',
    blocks: [
      { id: 'b-19', type: 'heading_1', content: 'Personal Operating System' },
      { id: 'b-20', type: 'text', content: 'Central hub for marathon preparation, wellness habits, financial independence, and travel ideas.' },
      { id: 'b-21', type: 'heading_2', content: 'Weekly Pillars' },
      { id: 'b-22', type: 'bullet_list', content: 'Physical: 45km weekly running mileage + 2 strength sessions' },
      { id: 'b-23', type: 'bullet_list', content: 'Mental: 10m daily box breathing meditation' },
      { id: 'b-24', type: 'bullet_list', content: 'Financial: 50% savings rate towards investment goals' }
    ]
  },
  {
    id: 'page-travel',
    title: 'Travel & Exploration 2026',
    icon: '✈️',
    parentId: 'page-personal',
    isFavorite: false,
    category: 'Personal',
    updatedAt: '2026-08-20T14:00:00',
    createdAt: '2026-08-10T12:00:00',
    blocks: [
      { id: 'b-25', type: 'heading_1', content: 'Japan Autumn Expedition' },
      { id: 'b-26', type: 'text', content: 'Planning 14 days across Tokyo, Kyoto, and Hokkaido in late November.' },
      { id: 'b-27', type: 'todo', content: 'Book Shinkansen Rail Pass', checked: false },
      { id: 'b-28', type: 'todo', content: 'Reserve Ryokan in Kyoto with private onsen', checked: false }
    ]
  }
];

export const mockDatabases: Database[] = [
  {
    id: 'db-applications',
    name: 'Job Applications Tracker',
    icon: '💼',
    description: 'Pipeline of active job opportunities, interviews, and status tracking.',
    properties: [
      { id: 'company', name: 'Company', type: 'text' },
      { id: 'role', name: 'Role', type: 'text' },
      {
        id: 'status',
        name: 'Status',
        type: 'status',
        options: [
          { id: 'applied', label: 'Applied', color: '#0284C7' },
          { id: 'interview', label: 'Interviewing', color: '#4343D5' },
          { id: 'offer', label: 'Offer Received', color: '#1A8754' },
          { id: 'rejected', label: 'Archived', color: '#767586' }
        ]
      },
      { id: 'appliedDate', name: 'Applied Date', type: 'date' },
      { id: 'followUp', name: 'Follow Up', type: 'date' },
      {
        id: 'priority',
        name: 'Priority',
        type: 'select',
        options: [
          { id: 'high', label: 'High', color: '#BA1A1A' },
          { id: 'medium', label: 'Medium', color: '#D97706' },
          { id: 'low', label: 'Low', color: '#767586' }
        ]
      },
      { id: 'notes', name: 'Notes', type: 'text' }
    ],
    views: [
      { id: 'v-table', name: 'All Applications', type: 'table', sortBy: 'appliedDate', sortOrder: 'desc' },
      { id: 'v-board', name: 'Pipeline Board', type: 'board', groupBy: 'status' },
      { id: 'v-calendar', name: 'Follow Up Calendar', type: 'calendar' },
      { id: 'v-list', name: 'Compact List', type: 'list' }
    ],
    rows: [
      {
        id: 'row-1',
        company: 'Stripe',
        role: 'Senior Full Stack Engineer',
        status: 'interview',
        appliedDate: '2026-08-18',
        followUp: '2026-08-30',
        priority: 'high',
        notes: 'Technical screen scheduled. Practice concurrency and API design.'
      },
      {
        id: 'row-2',
        company: 'Vercel',
        role: 'Frontend Systems Engineer',
        status: 'applied',
        appliedDate: '2026-08-22',
        followUp: '2026-09-02',
        priority: 'high',
        notes: 'Referred by alumni engineer. Showcasing LifeSync platform.'
      },
      {
        id: 'row-3',
        company: 'Google',
        role: 'Software Engineer III',
        status: 'applied',
        appliedDate: '2026-08-15',
        followUp: '2026-08-30',
        priority: 'high',
        notes: 'Followed up with recruiter on LinkedIn.'
      },
      {
        id: 'row-4',
        company: 'Linear',
        role: 'Product Engineer',
        status: 'interview',
        appliedDate: '2026-08-10',
        followUp: '2026-09-01',
        priority: 'medium',
        notes: 'Take-home app submitted. Loved the keyboard-first ergonomics.'
      },
      {
        id: 'row-5',
        company: 'Figma',
        role: 'Design Technologist',
        status: 'offer',
        appliedDate: '2026-07-28',
        followUp: '2026-09-05',
        priority: 'high',
        notes: 'Offer letter received! Reviewing compensation package.'
      }
    ]
  },
  {
    id: 'db-reading',
    name: 'Reading List & Book Vault',
    icon: '📖',
    description: 'Curated library of books, takeaways, and completion ratings.',
    properties: [
      { id: 'title', name: 'Book Title', type: 'text' },
      { id: 'author', name: 'Author', type: 'text' },
      {
        id: 'status',
        name: 'Status',
        type: 'status',
        options: [
          { id: 'reading', label: 'Currently Reading', color: '#4343D5' },
          { id: 'completed', label: 'Completed', color: '#1A8754' },
          { id: 'to_read', label: 'To Read', color: '#D97706' }
        ]
      },
      { id: 'rating', name: 'Rating (out of 5)', type: 'number' },
      { id: 'genre', name: 'Genre', type: 'select' }
    ],
    views: [
      { id: 'v-read-table', name: 'All Books', type: 'table' },
      { id: 'v-read-board', name: 'Reading Stage', type: 'board', groupBy: 'status' }
    ],
    rows: [
      { id: 'r-1', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', status: 'reading', rating: 5, genre: 'Engineering' },
      { id: 'r-2', title: 'Atomic Habits', author: 'James Clear', status: 'completed', rating: 5, genre: 'Productivity' },
      { id: 'r-3', title: 'Deep Work', author: 'Cal Newport', status: 'completed', rating: 5, genre: 'Productivity' },
      { id: 'r-4', title: 'Clean Architecture', author: 'Robert C. Martin', status: 'completed', rating: 4, genre: 'Engineering' },
      { id: 'r-5', title: 'Thinking in Systems', author: 'Donella Meadows', status: 'to_read', rating: 0, genre: 'Philosophy' }
    ]
  }
];

export const mockInsights: AIInsight[] = [
  {
    id: 'ins-1',
    title: 'Morning Clarity & Focus Window',
    message: 'You have a busy afternoon with recruiter follow-ups, but your morning is clear between 8:30 AM and 11:00 AM. Consider completing your highest-priority Spring Boot module before lunch.',
    category: 'Daily Plan',
    type: 'clarity',
    timestamp: 'Today, 8:00 AM',
    actionLabel: 'View Schedule Timeline',
    actionType: 'NAVIGATE',
    actionPayload: '/calendar'
  },
  {
    id: 'ins-2',
    title: 'Postponed Task Alert',
    message: 'You have postponed "Update Portfolio case study" 3 times this week. Would you like me to break it down into smaller 15-minute micro-tasks?',
    category: 'Productivity',
    type: 'proactive',
    timestamp: 'Today, 9:15 AM',
    actionLabel: 'Yes, break it down',
    actionType: 'BREAK_DOWN_TASK',
    actionPayload: 'task-3'
  },
  {
    id: 'ins-3',
    title: 'Goal Pace Observation',
    message: 'Your Marathon Training is currently 18% behind weekly mileage. Adding an 8km tempo run this evening will recover 60% of the deficit.',
    category: 'Goal',
    type: 'suggestion',
    timestamp: 'Yesterday',
    actionLabel: 'Adjust Weekly Plan',
    actionType: 'ADJUST_GOAL',
    actionPayload: 'goal-2'
  },
  {
    id: 'ins-4',
    title: 'Habit Consistency Trend',
    message: 'You complete 32% more tasks when you plan your day in advance during your 7:30 AM morning check-in.',
    category: 'Habit',
    type: 'observation',
    timestamp: '2 days ago'
  }
];


export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'AI Proactive Observation',
    message: 'You completed your morning learning session 15 minutes early. Ready to schedule your 11:00 AM interview preparation?',
    timestamp: '10 mins ago',
    read: false,
    type: 'ai'
  },
  {
    id: 'notif-2',
    title: 'Reminder: TechCorp Screening Interview',
    message: 'Interview starts at 11:00 AM on Google Meet. Join link is ready.',
    timestamp: '45 mins ago',
    read: false,
    type: 'reminder'
  },
  {
    id: 'notif-3',
    title: 'Goal Streak Milestone reached!',
    message: 'You have maintained your 14-day streak on "Morning Deep Learning". Keep it up!',
    timestamp: '2 hours ago',
    read: true,
    type: 'goal'
  }
];

export const mockInitialChat: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Good morning! I have organized your day. You have an interview screening at 11:00 AM, 3 priority tasks, and a clear 2-hour deep focus window right now. How can I help you succeed today?',
    timestamp: '8:00 AM',
    cards: [
      {
        title: 'Today’s Suggested Focus',
        items: [
          '🎯 High Priority: Spring Boot REST & JPA Architecture (90m)',
          '📞 11:00 AM: TechCorp Engineering Screening Call',
          '⚡ 2:30 PM: Outreach to Stripe & Google HR'
        ],
        actionLabel: 'Accept Daily Schedule',
        actionType: 'ACCEPT_SCHEDULE'
      }
    ]
  }
];
