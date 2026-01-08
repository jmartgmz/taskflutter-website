// Types for data from the backend API
export interface BackendTask {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  butterfly: {
    id: string;
    origin: string;
    size: number;
    isCaught: boolean;
    pointsAwarded: number;
  } | null;
}

export interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userPoints: number;
  emailVerified: string | null;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  tasks: Array<{
    id: string;
    title: string;
    completedAt: string | null;
  }>;
  authentications: Array<{
    id: string;
    provider: string;
  }>;
}

export interface BackendButterfly {
  id: string;
  taskId: string;
  origin: string;
  size: number;
  isCaught: boolean;
  caughtAt: string | null;
  pointsAwarded: number;
  createdAt: string;
  task: {
    id: string;
    title: string;
    userId: string;
  };
}

export interface BackendShopItem {
  id: string;
  userId: string;
  itemName: string;
  itemType: string;
  itemColor: string;
  itemCost: number;
  itemDescription: string | null;
  isOwned: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
