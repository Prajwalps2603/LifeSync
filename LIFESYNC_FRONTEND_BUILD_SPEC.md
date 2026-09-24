# LifeSync AI — Frontend Build Specification

## 1. Project Overview

**Product:** LifeSync AI  
**Positioning:** Your Personal AI Operating System  
**Tagline:** Your life, organized. Your decisions, easier.

LifeSync AI is a personal life companion designed to help a user remember, organize, track, plan, reflect, and make better decisions. It should feel like a combination of a personal assistant, trusted colleague, friend, knowledge workspace, productivity system, and AI companion.

The product combines two important ideas:

1. **Flexible workspace / knowledge system inspired by Notion's underlying logic**
2. **Proactive personal AI that understands the relationships between the user's information**

Do **not** copy Notion's visual design. Use the concepts of pages, nested pages, blocks, databases, relations, multiple views, templates, and flexible organization, while maintaining LifeSync's own visual identity.

---

# 2. Current Scope

## Phase 1 — Frontend ONLY

Build the complete frontend experience first.

For this phase:

- No authentication
- No login/register pages
- No real database
- No backend dependency
- No real AI API
- No external integrations required
- Use realistic mock data
- Use local frontend state where interaction is needed
- All major interactions should feel functional
- Architecture should make future backend/API integration easy

The frontend should look and behave like a real production application even though the data is currently mocked.

## Phase 2 — Backend (Later)

After the frontend is approved, the project will add:

- Authentication
- Database
- REST APIs / service layer
- User-specific data
- AI APIs
- Persistent memory
- Notifications
- Integrations

**Do not implement Phase 2 now.**

However, build Phase 1 in a way that does not make Phase 2 difficult.

---

# 3. Core Product Idea

LifeSync should not feel like a collection of disconnected CRUD pages.

Everything should eventually be connected.

Example:

```text
Goal
  ↓
Project
  ↓
Tasks
  ↓
Notes
  ↓
Calendar
  ↓
Memories
  ↓
AI Insights
```

For example:

> Goal: Become a Full Stack Developer
>
> Project: Career Development
>
> Tasks: Learn Spring Boot, build portfolio, apply to jobs
>
> Notes: Interview preparation
>
> Calendar: Interview on Friday
>
> Memory: User prefers studying in the morning
>
> AI Insight: The user is behind on the interview-preparation plan

The frontend should visually communicate this connected-system concept.

---

# 4. Design Reference

The supplied LifeSync designs establish the visual direction:

- Modern minimalism
- Digital Zen aesthetic
- Soft off-white background
- White content surfaces
- Deep indigo / violet primary accent
- Manrope for headlines
- Inter for body/interface text
- Soft glassmorphism used selectively
- Ambient shadows instead of heavy borders
- Rounded cards and soft geometry
- Generous whitespace
- Calm, premium, intelligent appearance

The design system reference defines an 8px spacing base, a 280px desktop sidebar, a maximum content width around 1440px, 24px gutters, 16–24px card radii, and indigo primary styling. Preserve this design language. Do not replace it with a generic dashboard theme.

Primary visual references include the supplied screens for:

- Home dashboard
- My Day
- Tasks
- Projects
- Goals
- Habits
- Calendar — Day / Week / Month
- Insights
- Memories
- AI Assistant
- Onboarding

These screens should be treated as visual references, not rigid page-by-page implementation limits.

---

# 5. Design System

## Colors

Use a restrained palette.

```text
Background:       #FBF9F8
Surface:          #FFFFFF
Surface Soft:     #F5F3F3
Primary:          #4343D5
Primary Bright:   #5D5FEF
Primary Soft:     #E1E0FF
Text Primary:     #1B1C1C
Text Secondary:   #464555
Outline:          #767586
Outline Soft:     #C7C4D7
Success:          green semantic tone
Warning:          amber semantic tone
Error:            #BA1A1A
```

Use the primary accent sparingly for:

- Active navigation
- Primary CTA buttons
- AI presence
- Progress indicators
- Selected states
- Important links

Avoid excessive purple/blue everywhere.

## Typography

Headlines:

- Manrope
- Large, confident, friendly

Body and UI:

- Inter
- Highly readable

Suggested scale:

```text
Display:   48px / 56px
Heading:   32px / 40px
Subheading 24px / 32px
Body:      16px / 24px
Small:     14px / 20px
Caption:   12px / 16px
```

## Spacing

Use an 8px spacing system.

Preferred values:

```text
8px
16px
24px
32px
40px
48px
64px
```

## Radius

```text
Small controls:    8px
Cards:             16px
Large panels:      20–24px
Pills/tags:        9999px
```

## Elevation

Prefer tonal layering and soft ambient shadows.

Do not use heavy black shadows or strong outlines.

Glass effects should be subtle and purposeful, especially for AI overlays and floating panels.

---

# 6. Global Application Layout

Desktop layout:

```text
┌─────────────────────────────────────────────────────────────┐
│                        Top Bar                              │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│   Sidebar     │              Main Content                   │
│               │                                             │
│               │                                             │
│               │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

## Sidebar

Use a persistent left sidebar approximately 280px wide on desktop.

Recommended structure:

```text
LifeSync AI
Your Personal AI Companion

HOME
  Home
  My Day
  AI Companion

WORKSPACE
  Pages
  Databases
  Templates

LIFE
  Tasks
  Projects
  Goals
  Habits
  Notes
  Calendar
  Expenses
  Memories

INSIGHTS
  Insights

----------------------
Quick Action
Settings
Profile
```

The sidebar should support nested workspace pages.

Example:

```text
Pages
  Career
    Job Search
    Learning
    Resume
  Personal
    Finance
    Travel
    Ideas
  Projects
    LifeSync
    Portfolio
```

Active navigation should use a subtle indigo vertical indicator and soft highlighted background.

## Top Bar

Depending on the page, include:

- Global search
- AI Chat / AI Companion button
- Notification button
- Quick Add
- Profile avatar

Keep top bars minimal.

---

# 7. Global Quick Add

Quick Add must be available from the main application shell.

Clicking Quick Add opens a polished modal/popover with:

```text
Create

Task
Note
Reminder
Event
Expense
Goal
Habit
Page
Database
Memory
```

Also include:

### Tell LifeSync naturally

Example input:

> Remind me tomorrow at 9 AM to call HR and send my updated resume.

Show a mocked AI parsing result:

```text
TASK
Call HR

TASK
Send updated resume

REMINDER
Tomorrow · 9:00 AM

CATEGORY
Career
```

Actions:

- Create All
- Edit
- Cancel

This is frontend simulation only in Phase 1.

---

# 8. Global Search

Search should be visually prominent and available from the application shell.

Search across mock content:

- Pages
- Blocks
- Tasks
- Projects
- Goals
- Habits
- Notes
- Memories
- Databases
- Calendar events
- Expenses

Include an "Ask LifeSync" state.

Example:

> What have I been working on this week?

Show grouped results rather than a plain text search page.

---

# 9. Home Dashboard

The Home Dashboard is the personal command center.

Header:

```text
Good morning, [Name]
Here's what's happening in your life today.
```

Main sections:

## Morning Clarity

A contextual AI insight card.

Example:

> You have a busy afternoon, but your morning is relatively clear. Consider completing your highest-priority project task before lunch.

CTA:

- View Project Timeline

## Summary Cards

Show compact indicators such as:

- Tasks due today
- Upcoming events
- Active goals
- Habit progress
- Important reminders

## Priority Tasks

Show task name, project/category, priority, due date, completion state.

## My Day

Compact timeline of today's schedule.

## Recent Memories

Show recent items LifeSync remembers.

## AI Proactive Card

Example:

> You've postponed "Update Portfolio" three times this week. Would you like me to break it down into 15-minute micro-tasks?

Buttons:

- Yes, break it down
- Dismiss

## Continue Where You Left Off

Show recently opened pages/projects.

The Home page should make the user immediately understand what needs attention and what LifeSync can do next.

---

# 10. My Day

Purpose: daily command center.

Header:

```text
My Day
Tuesday, October 24
```

Divide content into:

- Morning
- Afternoon
- Evening

Each section can contain:

- Scheduled events
- Tasks
- Focus blocks
- Habits
- Reminders

Include an AI Daily Plan card.

Example:

> Based on your goals and meeting load today, I recommend a focused morning and a lighter afternoon.

Suggested actions:

- Block 2 hrs for proposal
- Take a 20m walk
- Batch emails at 4:30 PM

Buttons:

- Accept Plan
- Edit
- Regenerate

Show daily completion percentage.

---

# 11. AI Companion

This is a major product feature.

The AI screen must feel integrated with LifeSync, not like a generic ChatGPT clone.

Header:

```text
AI Companion
Your personal companion.
```

Conversation area with:

- User messages
- AI responses
- Context cards
- Suggested actions

Example:

User:
> Can you help me organize my thoughts for the upcoming team retreat planning session?

AI:
> I'd be happy to help. Based on your recent notes, here's a framework...

Context card:

```text
1. Objectives & Goals
2. Agenda & Timing
3. Logistics & Location
```

The AI can reference:

- Pages
- Tasks
- Projects
- Notes
- Calendar
- Goals
- Memories

Quick prompts:

- Plan my day
- What am I forgetting?
- Review my week
- Help me decide
- Create a plan
- Remember this

Input area:

```text
Ask LifeSync AI...
[attach] [voice] [send]
```

Use mocked assistant responses for now.

---

# 12. Workspace — Pages

This is where the Notion-inspired logic enters the product.

Pages should be flexible containers rather than fixed CRUD records.

Features to visually support:

- Create page
- Nested page
- Favorite/pin
- Rename
- Duplicate
- Move
- Archive
- Delete
- Add blocks
- Link related pages

Example page structure:

```text
Career

# Career Dashboard

Your long-term professional workspace.

[AI Insight]

You have 4 active job applications. 2 require follow-up this week.

# Job Search

☐ Apply to Java Developer
☐ Follow up with HR
☐ Prepare Spring Boot interview

# Applications

Database View

Company | Role | Status | Applied | Follow Up

# Notes

Interview preparation
Resume ideas
Learning roadmap
```

Pages should feel clean and editorial, not like forms.

---

# 13. Block Editor

Create a flexible page editor with block-based content.

Supported blocks:

- Text
- Heading
- To-do
- Bullet list
- Numbered list
- Toggle
- Quote
- Callout
- Divider
- Image
- File
- Code
- Table
- Database
- Calendar
- Timeline
- AI Block

Add a block using:

```text
+ Add block
```

Also visually support a slash-command menu:

```text
/text
/heading
/todo
/database
/calendar
/ai
/callout
```

The block editor should look lightweight and modern.

Avoid making it look like a traditional rich-text editor toolbar overload.

---

# 14. Databases

Create a LifeSync-style flexible database UI inspired by Notion's database concept.

Example:

## Job Applications

Properties:

- Company
- Role
- Status
- Applied Date
- Follow Up
- Priority
- Notes

Views:

- Table
- Board
- Calendar
- List
- Timeline

The interface should demonstrate that the same underlying information can be shown in multiple views.

Create mock interactions for switching views.

---

# 15. Relations

Entities should have visible relation information.

Example:

Project: LifeSync

```text
Related Goal
Become a Full Stack Developer

Related Tasks
12 tasks

Related Notes
4 notes

Related Calendar Events
3 events

Related Memories
2 memories
```

Add a relation section to detail panels.

This will prepare the frontend for future backend relationships.

---

# 16. Projects

Show project cards with:

- Project name
- Description
- Status
- Priority
- Progress
- Deadline
- Tasks completed
- Recent activity
- AI recommendation

Example projects:

```text
LifeSync Platform
Portfolio Refresh
Career Development
Personal Finance
```

Project detail should include:

- Overview
- Tasks
- Timeline
- Notes
- Activity
- Related goals
- Related calendar items
- AI recommendations

CTA:

**Ask LifeSync about this project**

---

# 17. Tasks

Task management should support:

- List view
- Board view
- Calendar view

Each task can show:

- Title
- Description
- Status
- Priority
- Due date
- Project
- Tags
- Reminder

Statuses:

```text
To Do
In Progress
Waiting
Completed
```

Include:

- Search
- Filter
- Sort
- Quick add
- Inline completion

Include an AI Suggestions section.

Example:

> You have 3 tasks related to Marketing due this week. Want me to draft a summary for your Friday review meeting?

---

# 18. Goals

Goals should feel motivational, visual, and connected to daily activity.

Sections:

- Active
- Long-term Vision
- Completed Recently

Goal cards show:

- Goal name
- Category
- Progress
- Deadline
- Milestones
- Streak
- Status

Example:

```text
Read 24 Books
45%
11 / 24 completed

Marathon Training
32%
18% behind schedule

Become Full Stack Developer
65%
```

Include AI Goal Coach.

Mock insight:

> Your current goal is 18% behind schedule. Would you like me to adjust your weekly plan?

---

# 19. Habits

Create a calm, highly visual habit tracker.

Features:

- Daily habits
- Weekly overview
- Completion rate
- Streaks
- Longest streak
- Total completions
- Categories

Examples:

```text
Morning Meditation
Deep Learning Session
Read 30 Pages
Exercise
```

Use calendar-like completion indicators and subtle progress visuals.

Include Habit Insight.

Example:

> You complete your learning habit most consistently on Monday, Wednesday, and Friday.

---

# 20. Notes

Notes should use the workspace/page/block philosophy instead of looking like a basic CRUD table.

Features:

- Note creation
- Rich blocks
- Tags
- Pin
- Archive
- Search
- Related pages
- Related tasks
- AI actions

AI actions:

- Summarize
- Extract tasks
- Create reminder
- Find related memories
- Turn note into project plan

Example:

User note:

> Call HR on Friday and send updated resume.

AI preview:

```text
Task → Call HR
Task → Send updated resume
Reminder → Friday
Category → Career
```

---

# 21. Calendar

Calendar must support:

- Day
- Week
- Month

Use the visual reference provided.

Include:

- Search events
- Add event
- Event cards
- Tasks within schedule
- Focus blocks
- Habit entries
- Reminders

The right-side context panel may show:

- Mini calendar
- Upcoming context
- Important tasks
- AI insight

Example AI prompt:

> You have a 2-hour free window between 2 PM and 4 PM. Would you like me to schedule your highest-priority task?

Buttons:

- Schedule Task
- Dismiss

Also show free-window visualization in Day/Week views.

---

# 22. Expenses

Create a personal finance page, not an accounting application.

Show:

- Monthly spending
- Income
- Balance
- Savings
- Budget usage
- Category breakdown
- Monthly trend

Example categories:

- Food
- Travel
- Shopping
- Bills
- Education
- Entertainment
- Other

Include AI Financial Insight.

Example:

> Your food spending is higher than last month. Would you like me to show the main changes?

---

# 23. Memories

Memories are one of LifeSync's core differentiators.

Purpose:

> Things LifeSync remembers for you.

Memory categories:

- Personal
- Work
- Learning
- Preferences
- Decisions
- Important Dates
- People
- Projects

Memory card should show:

- Memory title
- Content
- Category
- Date
- Importance
- Source

Example:

```text
Coffee Preference

Prefers oat milk flat white, strictly no sugar.
Usually orders around 9:30 AM.

Learned from Calendar & Receipts
```

Allow visual actions:

- Edit
- Forget
- Pin
- Mark Important

Top search:

> Ask LifeSync what it remembers about me...

Also include AI-generated observations.

Example:

> I've noticed you tend to schedule creative tasks on Thursday mornings. Want me to protect that time next week?

---

# 24. Insights

Create an AI-powered life analytics screen.

Header:

```text
Life Insights
Your holistic view of productivity, habits, and progress.
```

Sections:

## AI Observations

Examples:

> You complete 32% more tasks when you plan your day in advance.

> Consistent schedules correlate with higher goal completion in your activity history.

## Productivity

Show weekly chart.

## Finance

Show spending breakdown.

## Goal Progress

Show progress indicators.

## Habit Trends

Show completion patterns.

The visual style should remain calm and understandable.

Avoid analytics overload.

---

# 25. Templates

Create reusable templates for:

- Personal Dashboard
- Job Search
- Project Management
- Learning System
- Travel Planner
- Finance Tracker
- Goal Tracker
- Meeting Notes
- Daily Journal
- Weekly Review

Template cards should have previews and a clear action:

**Use Template**

---

# 26. Life Graph

Create a page or view called:

**Life Graph**

Purpose:

Visually show how different parts of life are connected.

Example:

```text
                    Career Goal
                         │
                 Full Stack Developer
                         │
            ┌────────────┼────────────┐
            │            │            │
        Learning      Projects      Job Search
            │            │            │
       Spring Boot     LifeSync    Applications
            │            │            │
          Notes       Calendar     Interviews
```

Use an elegant node-and-connection UI.

Keep it lightweight and readable.

Clicking a node should open a detail panel with related items.

The graph can use mock data for Phase 1.

---

# 27. Responsive Design

Desktop-first but fully responsive.

## Desktop

- Persistent sidebar
- Multi-column layouts
- Right-side context panels where useful

## Tablet

- Collapsible sidebar/drawer
- Two-column content where appropriate

## Mobile

Use a compact bottom navigation.

Recommended primary mobile navigation:

```text
Home
My Day
Tasks
AI
More
```

Quick Add and AI must remain easy to access.

Cards should stack naturally.

Never require horizontal scrolling for core workflows.

---

# 28. Micro-Interactions

Use subtle interactions:

- Hover states
- Active states
- Smooth page transitions
- Task completion animation
- Progress updates
- Modal transitions
- AI typing/thinking state
- Toast notifications
- Sidebar collapse animation
- View switching animation

Do not over-animate.

The emotional goal is **calm intelligence**.

---

# 29. Loading, Empty, Error States

Every major page needs polished states.

## Loading

Use skeleton loaders.

AI loading text:

> LifeSync is connecting the dots...

## Empty

Examples:

Tasks:
> Nothing on your plate yet.
> Add your first task and let LifeSync help organize it.

Memories:
> Your memory is still growing.
> Tell LifeSync something worth remembering.

Projects:
> Ready to build something?

## Error

Use friendly error messages and retry actions.

---

# 30. Frontend Data Strategy for Phase 1

Use mock data in a centralized way.

Recommended structure:

```text
src/
  components/
  layouts/
  pages/
  features/
  data/
  hooks/
  services/
  types/
  utils/
```

Recommended feature areas:

```text
features/
  dashboard/
  ai/
  workspace/
  pages/
  databases/
  tasks/
  projects/
  goals/
  habits/
  notes/
  calendar/
  expenses/
  memories/
  insights/
```

Create clear TypeScript models/interfaces for mock data.

Examples:

```text
Task
Project
Goal
Habit
Note
Memory
CalendarEvent
Expense
WorkspacePage
Database
DatabaseView
Relation
AIInsight
Notification
```

Do not tightly couple UI components to hardcoded strings scattered throughout the code.

---

# 31. Future Backend Boundary

Although there is no backend yet, create service boundaries that can later be replaced by API calls.

Example:

```text
services/
  taskService
  projectService
  goalService
  habitService
  noteService
  calendarService
  expenseService
  memoryService
  pageService
  databaseService
  aiService
```

For Phase 1 these services may simply return mock data.

Later they can call the backend without rewriting the UI.

Example concept:

```ts
TaskService.getTasks()
TaskService.createTask()
TaskService.updateTask()
TaskService.deleteTask()
```

Do not connect to a real database now.

---

# 32. Future AI Boundary

Create a frontend AI service abstraction.

Example:

```text
AIService.ask()
AIService.generateDailyPlan()
AIService.extractTasks()
AIService.generateInsight()
AIService.summarize()
AIService.createMemory()
```

For now, return deterministic mock responses.

Do not integrate a real AI API in Phase 1.

---

# 33. State Management

Use a simple, maintainable frontend state strategy.

Use local component state for simple UI interactions.

Use a centralized store/context only where shared state is actually needed.

Potential shared state:

- Current workspace/page
- Sidebar state
- Quick Add modal
- Notifications
- AI conversation
- Selected calendar date
- Filters
- User preferences

Avoid unnecessary complexity.

---

# 34. Navigation Rules

Routes should exist for all major screens.

Recommended routes:

```text
/
/my-day
/ai
/workspace
/workspace/pages
/workspace/pages/:pageId
/workspace/databases
/workspace/databases/:databaseId
/workspace/templates
/tasks
/projects
/projects/:projectId
/goals
/habits
/notes
/notes/:noteId
/calendar
/expenses
/memories
/insights
/life-graph
/settings
/profile
```

No authentication route is needed now.

The app should open directly into the application experience.

---

# 35. Important UX Rules

1. Never make the user feel like they are operating a complicated database.

2. CRUD functionality should be invisible beneath a polished experience.

3. AI should appear contextually and help the user take action.

4. LifeSync should proactively surface useful information.

5. Pages should feel flexible and personal.

6. Data should feel connected.

7. Keep the visual design calm even when the application contains lots of information.

8. Prefer progressive disclosure over showing everything at once.

9. Keep important actions close to the user's context.

10. Never turn the AI experience into an isolated chatbot-only product.

---

# 36. Frontend Acceptance Criteria

The Phase 1 frontend is considered complete only when:

- All major routes exist
- The application shell is consistent
- Sidebar navigation works
- Responsive behavior works
- Mock data is realistic
- CRUD-like interactions are simulated in the UI
- Quick Add works visually
- Search works against mock data
- Page navigation works
- Workspace nesting is represented
- Block editor is visually functional
- Database views can switch
- Relation panels are visible
- AI interactions are mocked but believable
- Calendar Day / Week / Month are represented
- Empty/loading states exist
- Notifications have a visible UI
- Settings/profile screens exist
- No authentication is required
- No database is required
- No AI API is required
- No hardcoded UI architecture prevents future API integration

---

# 37. Implementation Priority

Build in this order.

## Stage 1 — Foundation

1. App shell
2. Sidebar
3. Top bar
4. Design tokens
5. Responsive layout
6. Global buttons/cards/forms/modals
7. Routing

## Stage 2 — Core Experience

8. Home Dashboard
9. My Day
10. Tasks
11. Projects
12. Goals
13. Habits

## Stage 3 — Workspace

14. Workspace navigation
15. Pages
16. Nested pages
17. Block editor
18. Databases
19. Database views
20. Relations
21. Templates

## Stage 4 — Intelligence

22. AI Companion
23. AI insights
24. Proactive recommendations
25. AI Quick Add simulation
26. Memories
27. Life Graph

## Stage 5 — Remaining Modules

28. Calendar
29. Notes
30. Expenses
31. Insights
32. Notifications
33. Settings
34. Profile

## Stage 6 — Polish

35. Loading states
36. Empty states
37. Error states
38. Accessibility
39. Mobile polish
40. Animation/micro-interactions
41. Visual consistency pass

---

# 38. Engineering Principles

Use reusable components instead of duplicating markup across pages.

Prefer feature-based organization.

Keep business/data logic separate from UI rendering.

Keep mock services behind interfaces so the backend can replace them later.

Keep AI calls behind a service abstraction.

Use semantic naming.

Maintain consistent typing.

Avoid premature backend assumptions.

Avoid authentication completely during this phase.

Avoid storing permanent data in a real database during this phase.

---

# 39. Final Product Experience

When the frontend is opened, the user should immediately feel:

> "This is a place where my whole life can live."

It should feel like:

```text
Notion-like flexibility
        +
Personal knowledge system
        +
Task/project management
        +
Calendar/planning
        +
Goals/habits
        +
Personal finance tracking
        +
Long-term memory
        +
Proactive AI companion
        =
LifeSync AI
```

The product should be visually premium but not flashy.

It should be intelligent but not intimidating.

It should be powerful but not cluttered.

It should feel like a **personal operating system**, not a generic CRUD dashboard.

---

# 40. Explicit Instruction to the Development Agent

**Build ONLY the frontend first.**

Do not stop after creating static screens.

Create a working frontend with:

- routing
- reusable components
- mock data
- interactive UI
- modals
- drawers
- filters
- search
- view switching
- simulated CRUD behavior
- page/block interactions
- responsive design
- AI mock interactions

Do not add:

- authentication
- database
- backend API
- real AI API
- payment system
- production user accounts

After the frontend is complete and visually approved, the next phase will connect the backend, database, authentication, and AI services.

**Primary goal for this phase:**

> Build a polished, responsive, production-quality frontend that captures the complete LifeSync AI vision and is ready to be connected to real services later.
