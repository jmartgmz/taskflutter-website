import { Suspense, useState } from 'react';
import { CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { useApiMutation, useApiQuery } from '../integrations/api';
import type { BackendTask } from '../types/backend';
import { Toast } from './Toast';
import { ConfirmModal } from './ConfirmModal';

interface TaskCardProps {
  task: BackendTask;
  onEdit?: (task: BackendTask) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
}

function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const isCompleted = task.completedAt !== null;
  const hasDueDate = task.dueDate !== null;
  const dueDate = hasDueDate ? new Date(task.dueDate!) : null;
  const isOverdue = hasDueDate && dueDate! < new Date() && !isCompleted;

  return (
    <div className="bg-white rounded shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <h3
          className={`text-lg font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ✓ Completed
            </span>
          )}
          {isOverdue && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Overdue
            </span>
          )}
        </div>
      </div>

      <div className="flex-1">
        {task.description && (
          <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
        )}

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div>
            <strong>User:</strong> {task.user.firstName} {task.user.lastName}
          </div>

          {hasDueDate && (
            <div>
              <strong>Due:</strong>{' '}
              {new Date(task.dueDate!).toLocaleDateString()}
            </div>
          )}

          {isCompleted && (
            <div>
              <strong>Completed:</strong>{' '}
              {new Date(task.completedAt!).toLocaleDateString()}
            </div>
          )}

          {task.butterfly && (
            <div className="mt-4 p-3 bg-purple-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>🦋</span>
                <strong className="text-purple-800">Butterfly</strong>
              </div>
              <div className="text-xs space-y-1">
                <div>
                  <strong>Origin:</strong> {task.butterfly.origin}
                </div>
                <div>
                  <strong>Size:</strong>{' '}
                  {Number(task.butterfly.size).toFixed(2)}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  {task.butterfly.isCaught ? '✓ Caught' : 'Available'}
                </div>
                <div>
                  <strong>Points:</strong> {task.butterfly.pointsAwarded}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isCompleted && (
        <div className="flex gap-2 pt-4 border-t border-gray-200 mt-auto">
          {onComplete && (
            <button
              onClick={() => onComplete(task.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
              title="Complete task"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TasksLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface BackendTasksClientProps {
  searchQuery?: string;
  onEdit?: (task: BackendTask) => void;
  editingTaskId?: string | null;
  onEditSubmit?: (
    id: string,
    updates: { title: string; description?: string; dueDate?: string },
  ) => Promise<void>;
}

function BackendTasksClient({
  searchQuery = '',
  onEdit,
}: BackendTasksClientProps) {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    taskId: string;
    taskTitle: string;
  } | null>(null);

  const {
    data: tasks,
    isLoading,
    error,
  } = useApiQuery<Array<BackendTask>>(['backend-tasks'], '/tasks');

  // API mutations for task operations
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
    invalidateKeys: [['backend-tasks'], ['users', 'me']], // Invalidate user query to refresh points
  });

  const deleteTaskMutation = useApiMutation<{ id: string }, unknown>({
    endpoint: (variables) => ({
      path: `/tasks/${variables.id}`,
      method: 'DELETE',
    }),
    invalidateKeys: [['backend-tasks']],
  });

  // Log successful data fetches in development
  if (import.meta.env.DEV && tasks) {
    console.log(`Loaded ${tasks.length} tasks from backend`);
  }

  const handleDelete = (id: string) => {
    const task = tasks?.find((t) => t.id === id);
    setConfirmModal({ taskId: id, taskTitle: task?.title || 'this task' });
  };

  const confirmDelete = async () => {
    if (!confirmModal) return;

    try {
      await deleteTaskMutation.mutateAsync({ id: confirmModal.taskId });
      setToast({ message: 'Task deleted successfully.', type: 'success' });
      setConfirmModal(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setToast({
        message: 'Failed to delete task. Please try again.',
        type: 'error',
      });
      setConfirmModal(null);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      // Find the task to get butterfly points
      const task = tasks?.find((t) => t.id === id);
      const pointsToEarn = task?.butterfly?.pointsAwarded || 0;

      await updateTaskMutation.mutateAsync({
        id,
        completedAt: new Date().toISOString(),
      });

      // Show success message with points earned
      if (pointsToEarn > 0) {
        setToast({
          message: `Task completed! You earned ${pointsToEarn} points! 🎉`,
          type: 'success',
        });
      } else {
        setToast({ message: 'Task completed! 🎉', type: 'success' });
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      setToast({
        message: 'Failed to complete task. Please try again.',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return <TasksLoadingSkeleton />;
  }

  if (error) {
    // More detailed error logging
    console.error('Backend Tasks Error:', error);

    return (
      <div className="bg-red-50 border border-red-200 rounded p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Tasks</h3>
        <p className="text-red-600">
          {error instanceof Error
            ? error.message
            : 'Failed to fetch tasks from backend'}
        </p>
        <p className="text-sm text-red-500 mt-2">
          Make sure your backend server is running on{' '}
          {import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}
        </p>
        <details className="mt-3">
          <summary className="text-sm text-red-600 cursor-pointer">
            Technical Details
          </summary>
          <pre className="text-xs text-red-500 mt-2 bg-red-100 p-2 rounded">
            {error instanceof Error ? error.stack : String(error)}
          </pre>
        </details>
      </div>
    );
  }

  // Filter tasks by search query
  const filteredTasks =
    tasks?.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    }) || [];

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white rounded shadow-md p-12 text-center">
        <span className="text-6xl mb-4 block">🦋</span>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Tasks Found
        </h3>
        <p className="text-gray-600">
          {searchQuery
            ? 'No tasks match your search.'
            : 'No tasks are currently available.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!confirmModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${confirmModal?.taskTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
}

interface BackendTasksProps {
  searchQuery?: string;
  onEdit?: (task: BackendTask) => void;
  editingTaskId?: string | null;
  onEditSubmit?: (
    id: string,
    updates: { title: string; description?: string; dueDate?: string },
  ) => Promise<void>;
}

export function BackendTasks({ searchQuery = '', onEdit }: BackendTasksProps) {
  return (
    <Suspense fallback={<TasksLoadingSkeleton />}>
      <BackendTasksClient searchQuery={searchQuery} onEdit={onEdit} />
    </Suspense>
  );
}
