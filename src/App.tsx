import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppShell } from './layouts/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth
import { LoginPage } from './features/auth/LoginPage';

// Admin
import { AdminPanel } from './features/admin/AdminPanel';

// Feature Pages
import { HomeDashboard } from './features/dashboard/HomeDashboard';
import { MyDayPage } from './features/myday/MyDayPage';
import { TasksPage } from './features/tasks/TasksPage';
import { ProjectsPage } from './features/projects/ProjectsPage';
import { ProjectDetailPage } from './features/projects/ProjectDetailPage';
import { GoalsPage } from './features/goals/GoalsPage';
import { HabitsPage } from './features/habits/HabitsPage';
import { PagesListPage } from './features/workspace/PagesListPage';
import { PageEditorPage } from './features/workspace/PageEditorPage';
import { DatabasesPage } from './features/workspace/DatabasesPage';
import { DatabaseViewPage } from './features/workspace/DatabaseViewPage';
import { TemplatesPage } from './features/workspace/TemplatesPage';
import { AiCompanionPage } from './features/ai/AiCompanionPage';
import { MemoriesPage } from './features/memories/MemoriesPage';
import { CalendarPage } from './features/calendar/CalendarPage';
import { NotesPage } from './features/notes/NotesPage';
import { NoteEditorPage } from './features/notes/NoteEditorPage';
import { ExpensesPage } from './features/expenses/ExpensesPage';
import { InsightsPage } from './features/insights/InsightsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { ProfilePage } from './features/profile/ProfilePage';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // ProtectedRoute handles the loading spinner

  return (
    <Routes>
      {/* ── Public: Login / Signup ── */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* ── Admin-only ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AppShell>
              <AdminPanel />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── All other protected routes ── */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<HomeDashboard />} />
                <Route path="/my-day" element={<MyDayPage />} />
                <Route path="/ai" element={<AiCompanionPage />} />
                <Route path="/workspace" element={<Navigate to="/workspace/pages" replace />} />
                <Route path="/workspace/pages" element={<PagesListPage />} />
                <Route path="/workspace/pages/:pageId" element={<PageEditorPage />} />
                <Route path="/workspace/databases" element={<DatabasesPage />} />
                <Route path="/workspace/databases/:databaseId" element={<DatabaseViewPage />} />
                <Route path="/workspace/templates" element={<TemplatesPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/notes/new" element={<NoteEditorPage />} />
                <Route path="/notes/:noteId/edit" element={<NoteEditorPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/memories" element={<MemoriesPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
