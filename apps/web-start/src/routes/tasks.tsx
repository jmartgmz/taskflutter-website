import { createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { Plus, Search, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BackendTasks } from '../components/BackendTasks';
import { TaskForm } from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { useApiMutation, useCurrentUser } from '../integrations/api';
import { Header } from '../components/Header';
import type { TaskPriority, TaskSize } from '../types';
import type { BackendTask } from '../types/backend';

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
});

function TasksPage() {
  // All hooks must be called at the top, before any conditional returns
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
  } = useAuth0();
  const { showLoading, isAuthPending } = useCurrentUser();
  const { createTask } = useTasks();

  // API mutation for updating tasks
  const updateTaskMutation = useApiMutation<
    {
      id: string;
      title?: string;
      description?: string;
      dueDate?: string;
      completedAt?: string | null;
    },
    unknown
  >({
    endpoint: (variables) => ({
      path: `/tasks/${variables.id}`,
      method: 'PATCH',
    }),
    invalidateKeys: [['backend-tasks']],
  });

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<BackendTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Authentication checks (after all hooks)
  if (auth0Loading || showLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
          {isAuthPending && (
            <p className="text-gray-600 mt-2">Authenticating with server...</p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Not authenticated
          </h2>
          <p className="text-gray-600 mt-2">Please log in to view tasks.</p>
        </div>
      </div>
    );
  }

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

  const handleEditTask = async (data: {
    title: string;
    description?: string;
    size: TaskSize;
    priority: TaskPriority;
    estimatedMinutes?: number;
    dueDate?: string;
  }) => {
    if (editingTask) {
      try {
        await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
        });
        setEditingTask(null);
      } catch (error) {
        console.error('Failed to update task:', error);
        alert('Failed to update task. Please try again.');
      }
    }
  };

  const handleEditSubmit = async (
    id: string,
    updates: { title: string; description?: string; dueDate?: string },
  ) => {
    try {
      await updateTaskMutation.mutateAsync({
        id,
        ...updates,
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const handleEdit = (task: BackendTask) => {
    setEditingTask(task);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header
        activePage="tasks"
        userPicture={auth0User?.picture}
        userName={auth0User?.name}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Your Tasks
            </h1>
            <p className="text-gray-600">
              Manage your tasks and prepare them for catching butterflies!
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>

        {/* Search Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-4 mb-6 border border-purple-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Backend Tasks Section */}
        <BackendTasks
          searchQuery={debouncedSearchQuery}
          onEdit={handleEdit}
          editingTaskId={editingTask?.id || null}
          onEditSubmit={handleEditSubmit}
        />

        {/* Forms */}
        {showForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
            submitLabel="Create Task"
          />
        )}
        {editingTask && (
          <TaskForm
            initialData={{
              title: editingTask.title,
              description: editingTask.description || undefined,
              size: 'medium', // Default since BackendTask doesn't have size
              priority: 'medium', // Default since BackendTask doesn't have priority
              dueDate: editingTask.dueDate || undefined,
            }}
            onSubmit={handleEditTask}
            onCancel={() => setEditingTask(null)}
            submitLabel="Update Task"
          />
        )}
      </div>
    </div>
  );
}
