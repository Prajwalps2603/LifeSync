import { GoogleGenerativeAI } from '@google/generative-ai';
import { serverStore } from '../data/store';

// ─── Gemini Client ─────────────────────────────────────────────────────────────

let geminiClient: GoogleGenerativeAI | null = null;

export const initGemini = (): boolean => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️  [RAG] GEMINI_API_KEY not set. AI will use fallback mock responses.');
    return false;
  }
  geminiClient = new GoogleGenerativeAI(apiKey);
  console.log('✨ [RAG] Gemini AI initialized successfully!');
  return true;
};

export const isGeminiEnabled = (): boolean => geminiClient !== null;

// ─── Context Builder ───────────────────────────────────────────────────────────
// Pulls the user's LifeSync data and formats it as structured context
// for the Gemini prompt. This is the "Retrieval" part of RAG.

const buildUserContext = (): string => {
  const state = serverStore.getFullState();
  const today = new Date().toISOString().split('T')[0];

  // ── Tasks ──
  const pendingTasks = state.tasks.filter(t => t.status !== 'completed');
  const todayTasks   = pendingTasks.filter(t => t.dueDate === today);
  const urgentTasks  = pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');

  // ── Goals ──
  const activeGoals = state.goals.filter(g => g.status === 'active');
  const behindGoals = state.goals.filter(g => g.status === 'behind');

  // ── Habits ──
  const todayStr = today;
  const habitsCompletedToday = state.habits.filter(h => h.completionHistory[todayStr]);
  const habitsPendingToday   = state.habits.filter(h => !h.completionHistory[todayStr]);

  // ── Notes (last 10) ──
  const recentNotes = [...state.notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  // ── Memories ──
  const memories = state.memories.slice(0, 10);

  // ── Projects ──
  const activeProjects = state.projects.filter(p => p.status === 'in_progress');

  // ── Expenses (last 10) ──
  const recentExpenses = [...state.expenses].slice(0, 10);

  // ── Calendar (upcoming) ──
  const upcomingEvents = state.calendarEvents
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  const context = `
=== USER'S LIFESYNC DATA (Today: ${today}) ===

--- PENDING TASKS (${pendingTasks.length} total) ---
Today's Tasks (${todayTasks.length}):
${todayTasks.map(t => `• [${t.priority.toUpperCase()}] ${t.title} — due ${t.dueDate} ${t.dueTime || ''} (project: ${t.projectName || 'none'})`).join('\n') || 'None due today'}

High/Urgent Tasks:
${urgentTasks.slice(0, 8).map(t => `• [${t.priority.toUpperCase()}] ${t.title} — due ${t.dueDate}`).join('\n') || 'None'}

--- ACTIVE GOALS (${activeGoals.length}) ---
${activeGoals.map(g => `• ${g.name} [${g.category}] — ${g.progress}% progress, deadline: ${g.deadline}, status: ${g.status}`).join('\n') || 'No active goals'}

Behind Goals:
${behindGoals.map(g => `• ${g.name} — ${g.progress}% (target: ${g.target} ${g.unit})`).join('\n') || 'None behind'}

--- HABITS TODAY ---
Completed (${habitsCompletedToday.length}): ${habitsCompletedToday.map(h => h.name).join(', ') || 'None yet'}
Pending (${habitsPendingToday.length}): ${habitsPendingToday.map(h => h.name).join(', ') || 'All done!'}

--- ACTIVE PROJECTS (${activeProjects.length}) ---
${activeProjects.map(p => `• ${p.name} [${p.category}] — ${p.progress}% complete, deadline: ${p.deadline}`).join('\n') || 'None'}

--- RECENT NOTES (last 10) ---
${recentNotes.map(n => `• "${n.title}" — tags: ${n.tags?.join(', ') || 'none'} | preview: ${(n.content || '').replace(/<[^>]+>/g, '').slice(0, 120)}...`).join('\n') || 'No notes'}

--- MEMORIES & PREFERENCES (${memories.length}) ---
${memories.map(m => `• [${m.category || 'general'}] ${m.title}: ${m.content}`).join('\n') || 'No memories'}

--- UPCOMING CALENDAR EVENTS ---
${upcomingEvents.map(e => `• ${e.date} ${e.time || ''}: ${e.title} (${e.type || 'event'})`).join('\n') || 'No upcoming events'}

--- RECENT EXPENSES ---
${recentExpenses.map(e => `• ${e.date}: ${e.description || e.category} — ₹${e.amount} [${e.category}]`).join('\n') || 'No recent expenses'}

=== END OF USER DATA ===
`;

  return context;
};

// ─── System Prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are LifeSync AI — a highly intelligent, warm, and proactive personal life assistant embedded inside LifeSync, a personal life operating system.

Your job is to help users manage their tasks, goals, habits, notes, calendar, expenses, memories, and projects. You have access to their REAL data shown above.

Guidelines:
- Always reference the user's actual data when relevant (use real task names, goal names, dates, etc.)
- Be concise but insightful — lead with the most important point
- Be warm and encouraging, not robotic
- When suggesting actions, be specific (e.g., "You should complete 'Learn Spring Boot' today — it's high priority and due today")
- If data is missing or not enough to answer, say so honestly
- Format responses clearly — use bullet points for lists, but keep prose conversational
- For planning requests, create concrete, time-specific schedules
- Never make up data not present in the context

Today's date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
`;

// ─── RAG Chat Function ─────────────────────────────────────────────────────────

export const ragChat = async (userMessage: string): Promise<string> => {
  if (!geminiClient) {
    throw new Error('Gemini API not initialized');
  }

  // Build context from user's actual data
  const userContext = buildUserContext();

  // Compose the full prompt
  const fullPrompt = `${SYSTEM_PROMPT}

${userContext}

User's question / request: "${userMessage}"

Please respond helpfully based on the user's actual data above:`;

  try {
    const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('[RAG] Gemini API error:', error.message);
    throw new Error(`Gemini API error: ${error.message}`);
  }
};

// ─── Fallback Mock Response ────────────────────────────────────────────────────
// Used when Gemini is not configured, keeping the app functional.

export const mockRagResponse = (userText: string): string => {
  const lower = userText.toLowerCase();
  const state = serverStore.getFullState();
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = state.tasks.filter(t => t.dueDate === today && t.status !== 'completed');
  const urgentTasks = state.tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed');

  if (lower.includes('today') || lower.includes('plan') || lower.includes('day')) {
    return `Here's your focus for today:\n\n${todayTasks.map(t => `• [${t.priority.toUpperCase()}] ${t.title}`).join('\n') || '• No tasks due today — great time to plan ahead!'}\n\nYou have ${urgentTasks.length} urgent item(s) pending. Want me to help prioritize?`;
  }
  if (lower.includes('goal')) {
    const goals = state.goals.filter(g => g.status === 'active');
    return `You have ${goals.length} active goal(s):\n\n${goals.map(g => `• ${g.name} — ${g.progress}% complete (${g.status})`).join('\n') || 'No active goals yet.'}`;
  }
  if (lower.includes('habit')) {
    return `You're tracking ${state.habits.length} habit(s). Your top streak is ${Math.max(...state.habits.map(h => h.streak), 0)} days. Keep it up!`;
  }
  if (lower.includes('expense') || lower.includes('spend') || lower.includes('money')) {
    const total = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    return `You've logged ${state.expenses.length} expense(s) totaling ₹${total.toLocaleString('en-IN')}. Want a breakdown by category?`;
  }
  if (lower.includes('note')) {
    return `You have ${state.notes.length} note(s) in your library. Your most recent: "${state.notes[0]?.title || 'No notes yet'}".`;
  }
  return `I've reviewed your LifeSync data. You have ${state.tasks.filter(t => t.status !== 'completed').length} pending tasks, ${state.goals.filter(g => g.status === 'active').length} active goals, and ${state.habits.length} habits to track. What would you like to focus on?`;
};
