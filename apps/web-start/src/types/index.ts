export type TaskSize = 'small' | 'medium' | 'large' | 'extra-large';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  size: TaskSize;
  priority: TaskPriority;
  estimatedMinutes?: number;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  databaseId?: string; // ID of the task in the database (if synced)
}

export interface Butterfly {
  id: string;
  taskId: string;
  size: TaskSize;
  color: string;
  pattern: string;
  accessories?: Array<string>;
  caughtAt?: string;
}

export interface UserPoints {
  total: number;
  earnedToday: number;
  lastEarnedAt?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'habitat' | 'pattern' | 'accessory' | 'color';
  icon?: string;
  unlocked: boolean;
}
