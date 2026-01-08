import { createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { CheckCircle2, Trophy, Undo2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import {
  useApiMutation,
  useApiQuery,
  useCurrentUser,
} from '../integrations/api';
import { getPointsForTaskSize } from '../utils/taskUtils';
import { TaskCard } from '../components/TaskCard';
import { Header } from '../components/Header';
import type { BackendTask } from '../types/backend';
import { Toast } from '../components/Toast';
import { useState } from 'react';

export const Route = createFileRoute('/completed')({
  component: CompletedPage,
});

function CompletedPage() {
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
  } = useAuth0();
  const { showLoading, isAuthPending } = useCurrentUser();
  const { getCompletedTasks, points } = useTasks();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Fetch backend tasks
  const { data: backendTasks } = useApiQuery<Array<BackendTask>>(
    ['backend-tasks'],
    '/tasks',
    { scope: 'read:tasks' },
  );

  // Mutation to uncomplete a task
  const uncompleteTaskMutation = useApiMutation<{ id: string }, unknown>({
    endpoint: (variables) => ({
      path: `/tasks/${variables.id}`,
      method: 'PATCH',
    }),
    invalidateKeys: [['backend-tasks']],
  });

  const handleUncomplete = async (taskId: string) => {
    try {
      await uncompleteTaskMutation.mutateAsync({
        id: taskId,
        completedAt: null,
      } as any);
      setToast({
        message: 'Task marked as incomplete successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to uncomplete task:', error);
      setToast({
        message: 'Failed to uncomplete task. Please try again.',
        type: 'error',
      });
    }
  };

  // Authentication checks
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
          <p className="text-gray-600 mt-2">
            Please log in to view completed tasks.
          </p>
        </div>
      </div>
    );
  }

  const completedTasks = getCompletedTasks();
  const completedBackendTasks =
    backendTasks?.filter((task) => task.completedAt !== null) || [];

  // Calculate stats
  const totalTasks = completedTasks.length + completedBackendTasks.length;
  const pointsFromTasks = completedTasks.reduce((acc, task) => {
    const taskPoints = getPointsForTaskSize(task.size);
    return acc + taskPoints;
  }, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header
        activePage="completed"
        userPicture={auth0User?.picture}
        userName={auth0User?.name}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Completed Tasks 🎉
          </h1>
          <p className="text-gray-600">
            Look at all the butterflies you've caught!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-700">
                Tasks Completed
              </h2>
            </div>
            <p className="text-3xl font-bold text-green-600">{totalTasks}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-700">
                Total Points Earned
              </h2>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {pointsFromTasks}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-700">
                Current Points
              </h2>
            </div>
            <p className="text-3xl font-bold text-purple-600">{points}</p>
          </div>
        </div>

        {/* Completed Tasks List */}
        {totalTasks > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Completed Tasks
            </h2>

            {/* Backend Tasks (with undo) */}
            {completedBackendTasks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Recent Tasks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedBackendTasks
                    .sort(
                      (a, b) =>
                        new Date(b.completedAt || '').getTime() -
                        new Date(a.completedAt || '').getTime(),
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-500 line-through">
                            {task.title}
                          </h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ✓ Completed
                          </span>
                        </div>

                        <div className="flex-1">
                          {task.description && (
                            <p className="text-gray-600 mb-4 text-sm">
                              {task.description}
                            </p>
                          )}

                          <div className="space-y-2 text-sm text-gray-500 mb-4">
                            {task.dueDate && (
                              <div>
                                <strong>Due:</strong>{' '}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                            <div>
                              <strong>Completed:</strong>{' '}
                              {new Date(task.completedAt!).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleUncomplete(task.id)}
                            disabled={uncompleteTaskMutation.isPending}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Undo2 className="w-4 h-4" />
                            {uncompleteTaskMutation.isPending
                              ? 'Undoing...'
                              : 'Undo'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Local Storage Tasks (legacy) */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Archived Tasks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTasks
                    .sort(
                      (a, b) =>
                        new Date(b.completedAt || '').getTime() -
                        new Date(a.completedAt || '').getTime(),
                    )
                    .map((task) => (
                      <TaskCard key={task.id} task={task} showActions={false} />
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-12 text-center border border-purple-100">
            <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No completed tasks yet
            </h2>
            <p className="text-gray-600">
              Start catching butterflies to see your completed tasks here!
            </p>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
