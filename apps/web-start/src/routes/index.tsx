import { Link, createFileRoute } from '@tanstack/react-router';
import { Sparkles as ButterflyIcon, Plus } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import {
  useApiQuery,
  useCurrentUser,
  wakeUpBackend,
} from '../integrations/api';
import LoginButton from '../components/LoginButton';
import { Header } from '../components/Header';
import { TaskForm } from '../components/TaskForm';
import type { BackendTask } from '../types/backend';
import type { TaskPriority, TaskSize } from '../types';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Wake up the backend on app load (for Render free tier)
  useEffect(() => {
    wakeUpBackend();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ButterflyIcon className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated butterflies */}
      <div className="absolute inset-0 pointer-events-none max-w-4xl mx-auto">
        <div className="absolute top-20 left-10 animate-float opacity-20" style={{ animationDuration: '8s', filter: 'grayscale(100%) brightness(0.4) sepia(100%) hue-rotate(250deg) saturate(500%)' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute top-40 right-20 animate-float opacity-20" style={{ animationDuration: '10s', filter: 'grayscale(100%) brightness(0.4) sepia(100%) hue-rotate(250deg) saturate(500%)' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float opacity-20" style={{ animationDuration: '12s', filter: 'grayscale(100%) brightness(0.4) sepia(100%) hue-rotate(250deg) saturate(500%)' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float opacity-20" style={{ animationDuration: '9s', filter: 'grayscale(100%) brightness(0.4) sepia(100%) hue-rotate(250deg) saturate(500%)' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute bottom-20 right-10 animate-float opacity-20" style={{ animationDuration: '11s', filter: 'grayscale(100%) brightness(0.4) sepia(100%) hue-rotate(250deg) saturate(500%)' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute top-1/2 left-16 animate-float opacity-20" style={{ animationDuration: '10s', filter: 'grayscale(100%) brightness(0.4) sepia(100%) hue-rotate(250deg) saturate(500%)' }}>
          <span className="text-4xl">🦋</span>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded shadow-xl p-8 w-full max-w-lg border border-purple-100 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center">
              <span className="text-3xl" style={{ filter: 'brightness(0) invert(1)' }}>🦋</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            TaskFlutter
          </h1>
          <p className="text-gray-600 text-lg mb-1">
            Organize. Complete. Achieve.
          </p>
          <p className="text-gray-500 text-sm">
            Your productive task management companion
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded">
            <div className="shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Create Tasks</h3>
              <p className="text-gray-600 text-xs">Add your to-dos with priorities, and due dates</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-pink-50 rounded">
            <div className="shrink-0 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Catch Butterflies</h3>
              <p className="text-gray-600 text-xs">Catch butterflies to choose a task & earn points for completing tasks</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
            <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Shop & Customize</h3>
              <p className="text-gray-600 text-xs">Use your points to customize your butterflies</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <LoginButton />
          </div>

          <div className="pt-4">
            <p className="text-xs text-gray-500 text-center">
              Sign in to start managing tasks and building your butterfly collection
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              We are a group of 3 developers! Connect with us and give us some feedback!
            </p>
            <p className="text-xs font-medium text-gray-700 mb-2">
              Say hi to us! 👋
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <a
              href="https://github.com/UD-CISC474-F25/f25-cisc474-blue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth0();
  const { createTask } = useTasks();
  const [showForm, setShowForm] = useState(false);

  // Fetch user data to get points from database
  const { data: currentUser } = useCurrentUser();

  // Fetch backend tasks with authentication
  const {
    data: backendTasks,
    showLoading: backendLoading,
    error: backendError,
    isAuthPending,
  } = useApiQuery<Array<BackendTask>>(['backend-tasks'], '/tasks', {
    scope: 'read:tasks',
  });

  const points = currentUser?.userPoints || 0;

  // Count uncompleted tasks from database
  const uncompletedTasksCount =
    backendTasks?.filter((task) => task.completedAt === null).length || 0;

  const handleCreateTask = (data: {
    title: string;
    description?: string;
    size: TaskSize;
    priority: TaskPriority;
    estimatedMinutes?: number;
    dueDate?: string;
  }) => {
    createTask(data);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header
        activePage="home"
        userPicture={user?.picture}
        userName={user?.name}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || user?.email}! 🦋
          </h1>
          <p className="text-gray-600">
            Catch butterflies to complete your tasks and earn points!
          </p>
        </div>

        {/* Points and Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Active Tasks
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              {uncompletedTasksCount}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {uncompletedTasksCount === 1 ? 'task' : 'tasks'} waiting
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Your Points
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              {points}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              catch more for points
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Ready to Catch
            </h2>
            <Link
              to="/catch"
              className="inline-block mt-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Go Catch! 🦋
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded shadow-lg hover:shadow-xl transition-all text-gray-700 font-semibold border border-purple-100 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create New Task
            </button>
            <Link
              to="/tasks"
              className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded shadow-lg hover:shadow-xl transition-all text-gray-700 font-semibold border border-purple-100 hover:scale-105"
            >
              View All Tasks
            </Link>
          </div>
        </div>

        {/* Backend Tasks */}
        {isAuthPending ? (
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-12 text-center border border-purple-100">
            <ButterflyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Authenticating...
            </h2>
            <p className="text-gray-600">
              Verifying your credentials with the server
            </p>
          </div>
        ) : backendLoading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-12 text-center border border-purple-100">
            <ButterflyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Loading your tasks...
            </h2>
            <p className="text-gray-600">
              Fetching the latest data from the server
            </p>
          </div>
        ) : backendError ? (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded shadow-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">
              Error Loading Tasks
            </h3>
            <p className="text-red-600">
              {backendError instanceof Error
                ? backendError.message
                : 'Failed to fetch tasks from backend'}
            </p>
          </div>
        ) : backendTasks && backendTasks.length > 0 ? (
          <div>
            <div className="space-y-3">
              {backendTasks
                .filter((task) => !task.completedAt)
                .map((task) => {
                  // Calculate priority based on due date
                  const getPriorityColor = () => {
                    if (!task.dueDate) return 'border-gray-300';

                    const now = new Date();
                    const due = new Date(task.dueDate);
                    const daysUntilDue = Math.floor(
                      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                    );

                    if (daysUntilDue < 0) return 'border-red-500'; // Overdue
                    if (daysUntilDue <= 1) return 'border-orange-500'; // Due today or tomorrow
                    if (daysUntilDue <= 3) return 'border-yellow-500'; // Due within 3 days
                    if (daysUntilDue <= 7) return 'border-blue-500'; // Due within a week
                    return 'border-green-500'; // Due later
                  };

                  return (
                    <div
                      key={task.id}
                      className={`bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-r border-t border-b border-r-purple-100 border-t-purple-100 border-b-purple-100 ${getPriorityColor()} flex items-start justify-between gap-6`}
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {task.completedAt && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                ✓ Done
                              </span>
                            )}
                            {task.dueDate &&
                              new Date(task.dueDate) < new Date() &&
                              !task.completedAt && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                  Overdue
                                </span>
                              )}
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-gray-600 mb-4 text-sm">
                            {task.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-gray-500">
                          {task.dueDate && (
                            <div>
                              <strong>Due:</strong>{' '}
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}

                          {task.completedAt && (
                            <div>
                              <strong>Completed:</strong>{' '}
                              {new Date(task.completedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {task.butterfly && (
                        <div className="shrink-0 w-48 p-4 bg-purple-50 rounded border-2 border-purple-200">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🦋</span>
                            <strong className="text-purple-800 text-sm">
                              Butterfly Reward
                            </strong>
                          </div>
                          <div className="text-xs space-y-1.5 text-gray-700">
                            <div>
                              <strong>Origin:</strong> {task.butterfly.origin}
                            </div>
                            <div>
                              <strong>Size:</strong>{' '}
                              {Number(task.butterfly.size).toFixed(2)}
                            </div>
                            <div>
                              <strong>Status:</strong>{' '}
                              {task.butterfly.isCaught
                                ? '✓ Caught'
                                : 'Available'}
                            </div>
                            <div>
                              <strong>Points:</strong>{' '}
                              {task.butterfly.pointsAwarded}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-12 text-center border border-purple-100">
            <ButterflyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No tasks yet!
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first task to start catching butterflies!
            </p>
            <Link
              to="/tasks"
              className="inline-block px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
            >
              Create Your First Task
            </Link>
          </div>
        )}

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
            submitLabel="Create Task"
          />
        )}
      </div>
    </div>
  );
}
