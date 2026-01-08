import { useState, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { Task, TaskSize, TaskPriority } from '../types';
import { getPointsForTaskSize } from '../utils/taskUtils';
import { useApiMutation } from '../integrations/api';

const STORAGE_KEY = 'butterfly-tasks';
const STORAGE_POINTS_KEY = 'butterfly-points';

// Initialize with sample data if localStorage is empty
const getInitialTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading tasks from localStorage:', e);
  }
  return [];
};

const getInitialPoints = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_POINTS_KEY);
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch (e) {
    console.error('Error reading points from localStorage:', e);
  }
  return 0;
};

export function useTasks() {
  // Use lazy initialization to avoid calling functions during SSR
  const [tasks, setTasks] = useState<Task[]>(() => getInitialTasks());
  const [points, setPoints] = useState<number>(() => getInitialPoints());
  const { isAuthenticated } = useAuth0();

  // API mutation for creating tasks in the database
  const createTaskMutation = useApiMutation<
    {
      title: string;
      description?: string;
      dueDate?: string;
      size?: string;
      priority?: string;
    },
    unknown
  >({
    path: '/tasks',
    method: 'POST',
    invalidateKeys: [['backend-tasks']],
  });

  // API mutation for updating tasks in the database
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

  // API mutation for deleting tasks in the database
  const deleteTaskMutation = useApiMutation<{ id: string }, unknown>({
    endpoint: (variables) => ({
      path: `/tasks/${variables.id}`,
      method: 'DELETE',
    }),
    invalidateKeys: [['backend-tasks']],
  });

  // Sync tasks to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error('Error saving tasks to localStorage:', e);
      }
    }
  }, [tasks]);

  // Sync points to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_POINTS_KEY, points.toString());
      } catch (e) {
        console.error('Error saving points to localStorage:', e);
      }
    }
  }, [points]);

  const createTask = useCallback(
    async (taskData: {
      title: string;
      description?: string;
      size: TaskSize;
      priority: TaskPriority;
      estimatedMinutes?: number;
      dueDate?: string;
    }) => {
      // Generate a unique ID that works in both SSR and client
      const generateId = () =>
        `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newTask: Task = {
        id:
          typeof window !== 'undefined' &&
          typeof crypto !== 'undefined' &&
          crypto.randomUUID
            ? crypto.randomUUID()
            : generateId(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to local state immediately
      setTasks((prev) => [...prev, newTask]);

      // Also create in database if authenticated
      if (isAuthenticated) {
        try {
          const dbTask = (await createTaskMutation.mutateAsync({
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            size: taskData.size,
            priority: taskData.priority,
          })) as { id: string };

          // Store the database ID in the local task
          setTasks((prev) =>
            prev.map((task) =>
              task.id === newTask.id
                ? { ...task, databaseId: dbTask.id }
                : task,
            ),
          );
        } catch (error) {
          // Log error but don't fail the local creation
          console.error('Failed to create task in database:', error);
        }
      }

      return newTask;
    },
    [isAuthenticated, createTaskMutation],
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      // Find the task before updating (to get databaseId)
      const task = tasks.find((t) => t.id === id);
      const databaseId = task?.databaseId;

      // Update local state immediately
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task,
        ),
      );

      // Also update in database if authenticated and task has a databaseId
      if (isAuthenticated && databaseId) {
        try {
          // Map local task fields to database fields
          const dbUpdates: {
            title?: string;
            description?: string;
            dueDate?: string;
            completedAt?: string | null;
          } = {};
          if (updates.title !== undefined) dbUpdates.title = updates.title;
          if (updates.description !== undefined)
            dbUpdates.description = updates.description;
          if (updates.dueDate !== undefined)
            dbUpdates.dueDate = updates.dueDate;
          if (updates.completed !== undefined) {
            dbUpdates.completedAt = updates.completed
              ? updates.completedAt || new Date().toISOString()
              : null;
          } else if (updates.completedAt !== undefined) {
            dbUpdates.completedAt = updates.completedAt;
          }

          // Use databaseId for the endpoint path
          await updateTaskMutation.mutateAsync({
            id: databaseId,
            ...dbUpdates,
          });
        } catch (error) {
          // Log error but don't fail the local update
          console.error('Failed to update task in database:', error);
        }
      }
    },
    [isAuthenticated, updateTaskMutation, tasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      // Find the task before deleting (to get databaseId)
      const task = tasks.find((t) => t.id === id);
      const databaseId = task?.databaseId;

      // Delete from local state immediately
      setTasks((prev) => prev.filter((task) => task.id !== id));

      // Also delete from database if authenticated and task has a databaseId
      if (isAuthenticated && databaseId) {
        try {
          await deleteTaskMutation.mutateAsync({ id: databaseId });
        } catch (error) {
          // Log error but don't fail the local delete
          console.error('Failed to delete task in database:', error);
        }
      }
    },
    [isAuthenticated, deleteTaskMutation, tasks],
  );

  const completeTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task || task.completed) return;

      const pointsEarned = getPointsForTaskSize(task.size);
      setPoints((prev) => prev + pointsEarned);
      updateTask(id, {
        completed: true,
        completedAt: new Date().toISOString(),
      });
    },
    [tasks, updateTask],
  );

  const getActiveTasks = useCallback(() => {
    return tasks.filter((task) => !task.completed);
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter((task) => task.completed);
  }, [tasks]);

  return {
    tasks,
    points,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getActiveTasks,
    getCompletedTasks,
    setPoints,
  };
}
