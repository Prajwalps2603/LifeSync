<div align="center">

# ⚡ LifeSync AI
### *The Intelligent Life Operating System*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash_(RAG)-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Firebase Ready](https://img.shields.io/badge/Firebase-Firestore_&_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

<br/>

> **LifeSync AI** harmonizes your daily actions, long-term ambitions, knowledge, habits, and finances into a unified, high-performance workspace. Backed by **Gemini 1.5 Flash with live RAG (Retrieval-Augmented Generation)**, your AI companion answers questions directly grounded in your real schedule, goals, and notes.

<br/>

[✨ Features](#-key-features) • [🧠 RAG & AI](#-intelligent-ai-companion--rag) • [🛡️ RBAC & Admin](#️-role-based-access-control--admin-panel) • [🏗️ Architecture](#️-architecture) • [🚀 Quick Start](#-quick-start) • [⚙️ Configuration](#-configuration)

---

</div>

<br/>

## 🌟 Overview

Modern productivity tools are fragmented: one app for tasks, another for notes, a third for habits, and spreadsheets for finances. 

**LifeSync AI solves this fragmentation.** It provides an interconnected dashboard where tasks advance projects, habits compound toward goals, notes inform memory banks, and a contextual AI assistant provides personalized strategic advice based on your real life data.

```
                    ┌─────────────────────────┐
                    │   LifeSync AI Engine    │
                    │   (Gemini 1.5 Flash)    │
                    └───────────┬─────────────┘
                                │ Context Injection
    ┌───────────┬───────────────┼───────────────┬───────────┐
    ▼           ▼               ▼               ▼           ▼
┌───────┐  ┌─────────┐    ┌───────────┐    ┌─────────┐ ┌─────────┐
│ Tasks │  │ Habits  │    │ Knowledge │    │ Finance │ │ Goals   │
│ & OKR │  │ Tracker │    │  & Notes  │    │ & Money │ │ & Scope │
└───────┘  └─────────┘    └───────────┘    └─────────┘ └─────────┘
```

---

## ✨ Key Features

### 🎯 1. Productivity & Planning
- **My Day Flow**: Morning cognitive planning matched with circadian focus windows.
- **Tasks & Actions**: Kanban board, list views, priority matrix (`Urgent`, `High`, `Medium`, `Low`), and project association.
- **Projects & OKRs**: Multi-stage progress tracking with milestone checklists and deadlines.
- **Goals Matrix**: Track quantitative milestones, time-to-target calculations, and category groupings.
- **Habit Tracking**: Daily check-in matrix, current streak, record streak, and interactive history heatmaps.

### 🧠 2. Knowledge & Memory
- **Notes & Knowledge Vault**: Rich markdown editor with tags, category filters, and quick search.
- **Memory Bank**: Persistent AI memories, personal principles, and learned behavioral preferences.
- **Workspace Pages**: Modular documents with hierarchical nested sub-pages.
- **Relational Databases**: Grid tables, custom field definitions, and schema builders.

### 📅 3. Schedule & Finance
- **Interactive Calendar**: Event schedules, daily agenda views, and time blocking.
- **Expense & Budget Tracker**: Expense logging, category breakdown charts, and budget pacing.
- **Life Insights**: AI-generated analytics, productivity trends, and habit consistency indexes.

---

## 🤖 Intelligent AI Companion & RAG

LifeSync features a purpose-built **Retrieval-Augmented Generation (RAG)** pipeline. Unlike generic chat interfaces, LifeSync AI has dynamic access to your actual workspace.

### How RAG Works in LifeSync:
1. **User Query**: You ask *"What should I prioritize today?"* or *"Am I behind on my marathon training?"*
2. **Context Retrieval**: The backend RAG service queries your real state:
   - Today's pending & urgent tasks
   - Behind or active goals
   - Habit check-in status for today
   - Recent notes and saved memories
   - Upcoming calendar commitments
3. **Prompt Composition**: Assembles a structured snapshot into a high-density prompt.
4. **Gemini 1.5 Flash Inference**: Synthesizes specific, time-aware guidance citing your real task names and deadlines.
5. **Smart Fallback**: If no Gemini API key is configured, an integrated local context engine provides realistic context-aware responses seamlessly.

---

## 🛡️ Role-Based Access Control & Admin Panel

Enterprise-grade role separation built-in:

| Role | Access Level | Permissions |
|:---|:---|:---|
| 👑 **Admin** | Full Master Access | All features + `/admin` panel, live user role switching, feature toggles, system telemetry |
| 👤 **User** | Full Personal Access | Complete access to personal workspace, AI companion, tracking, and settings |
| 👁️ **Guest** | Read-Only Explorer | Instant 1-click trial (`/`, `/notes`, `/insights`), protected from state mutation |

### 🛠️ Master Admin Panel (`/admin`)
- **User Management**: Inspect registered users, elevate or demote roles (`admin` / `user` / `guest`), deactivate accounts in real-time.
- **Dynamic Feature Flags**: Toggle `AI Companion`, `RAG Context Search`, `Guest Access`, `New Sign-Ups`, or modules on/off with zero downtime.
- **System Telemetry**: Real-time monitoring of Node.js Express API, Firebase status, Vite dev server, and LLM latency.

---

## 🏗️ Architecture

LifeSync is built on a clean, decoupled full-stack architecture:

```
LifeSync/
├── src/                          # Frontend Application (React 19 + TypeScript + Vite)
│   ├── components/               # Reusable UI primitives (Buttons, Modals, Cards)
│   │   ├── auth/                 # ProtectedRoute & Role Guards
│   │   └── ui/                   # Design system tokens
│   ├── context/                  # React Contexts
│   │   ├── AuthContext.tsx       # Auth state, session persistence, role engine
│   │   └── AppContext.tsx        # UI state, global search, notifications
│   ├── features/                 # Modular Domain Features
│   │   ├── admin/                # Master Admin Dashboard
│   │   ├── ai/                   # AI Companion & Chat UI
│   │   ├── auth/                 # Login, Sign-up & Guest entry
│   │   ├── calendar/             # Calendar & Schedule management
│   │   ├── dashboard/            # Home analytics & widgets
│   │   ├── expenses/             # Personal finance & transactions
│   │   ├── goals/                # Goals & Milestones
│   │   ├── habits/               # Habit tracker & Streak engine
│   │   ├── notes/                # Knowledge vault & editor
│   │   ├── profile/              # User profile & session logout
│   │   ├── projects/             # Projects & milestones
│   │   └── tasks/                # Tasks & Kanban boards
│   ├── layouts/                  # AppShell, Sidebar, TopBar
│   ├── services/                 # Frontend API client layer with store hydration
│   └── types/                    # Unified TypeScript type definitions
│
├── server/                       # Backend Application (Node.js + Express 5)
│   ├── data/                     # In-Memory State Store (Firebase-ready abstraction)
│   ├── firebase/                 # Firebase Admin SDK & Firestore connector
│   ├── routes/                   # Domain API routers (/api/tasks, /api/ai, etc.)
│   ├── services/                 # RAG Service (Gemini 1.5 Flash client)
│   └── index.ts                  # Express server entry point & health check
│
├── .env                          # Environment credentials (API Keys, Ports)
└── package.json                  # Dependencies and scripts
```

---

## 💻 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 6](https://vitejs.dev/), [Vanilla CSS Design System](https://developer.mozilla.org/en-US/docs/Web/CSS), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Backend**: [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/), [dotenv](https://github.com/motdotla/dotenv), [CORS](https://github.com/expressjs/cors)
- **AI / LLM**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (`gemini-1.5-flash`)
- **Database & Cloud**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) (Cloud Firestore & Firebase Auth ready)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**

### 1. Clone Repository
```bash
git clone https://github.com/Prajwalps2603/LifeSync.git
cd LifeSync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create or edit your `.env` file in the root directory:
```env
# Server
PORT=5000

# Gemini AI (Optional - unlocks live RAG inference)
# Get a free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase (Optional - set true when connecting Firestore)
FIREBASE_ENABLED=false
```

### 4. Run Development Servers
Run both backend API server and Vite frontend concurrently:

```bash
# Terminal 1: Start Express API server (port 5000)
npm run server

# Terminal 2: Start Vite frontend (port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 🔑 Demo Credentials

| Role | Email | Password | Quick Access |
|:---|:---|:---|:---|
| 👑 **Admin** | `admin@lifesync.app` | `admin123` | Access `/admin` & all features |
| 👤 **User** | `prajwal@lifesync.app` | `user123` | Standard workspace access |
| 👁️ **Guest** | *None required* | *None required* | Click **"Login as Guest"** on login screen |

---

## 📦 Build for Production

To compile TypeScript and bundle the frontend into optimized production assets:

```bash
npm run build
```

Production output will be generated inside the `dist/` directory.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br/>

<div align="center">
  <sub>Crafted with passion for organized, mindful, and high-performance living.</sub>
</div>
