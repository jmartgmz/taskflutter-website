import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        butterfly: {
          select: {
            id: true,
            origin: true,
            size: true,
            isCaught: true,
            pointsAwarded: true,
          },
        },
      },
    });

    // Sort: uncompleted tasks first (completedAt is null), then by creation date (newest first)
    tasks.sort((a, b) => {
      // If one is completed and the other isn't, uncompleted comes first
      if (a.completedAt === null && b.completedAt !== null) return -1;
      if (a.completedAt !== null && b.completedAt === null) return 1;

      // If both are completed or both are uncompleted, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return tasks;
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        butterfly: {
          select: {
            id: true,
            origin: true,
            size: true,
            isCaught: true,
            pointsAwarded: true,
          },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    return task;
  }

  async create(
    userId: string,
    taskData: {
      title: string;
      description?: string;
      dueDate?: string;
      size?: string;
      priority?: string;
    },
  ) {
    // Create the task first
    const task = await this.prisma.task.create({
      data: {
        userId,
        title: taskData.title,
        description: taskData.description || null,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      },
    });

    // Generate butterfly for the task
    // 1. Get owned patterns for the user
    const ownedPatterns = await this.prisma.shopItem.findMany({
      where: {
        userId,
        itemType: 'pattern',
        isOwned: true,
      },
    });

    // 2. Select pattern (random from owned, or default)
    let origin = 'Default Butterfly';
    if (ownedPatterns.length > 0) {
      const randomIndex = Math.floor(Math.random() * ownedPatterns.length);
      origin = ownedPatterns[randomIndex].itemName;
    }

    // 3. Calculate butterfly size based on task size
    let butterflySize = 2; // default
    const taskSize = taskData.size?.toLowerCase();
    if (taskSize === 'small') {
      butterflySize = Math.random() * (2 - 1) + 1; // 1 to 2
    } else if (taskSize === 'medium') {
      butterflySize = Math.random() * (4 - 2) + 2; // 2 to 4
    } else if (taskSize === 'large') {
      butterflySize = Math.random() * (6 - 4) + 4; // 4 to 6
    } else if (taskSize === 'extra-large') {
      butterflySize = Math.random() * (10 - 6) + 6; // 6 to 10
    }

    // 4. Calculate points: size * priority (rounded to nearest whole number)
    const priorityMultiplier =
      taskData.priority === 'low'
        ? 1
        : taskData.priority === 'medium'
          ? 2
          : taskData.priority === 'high'
            ? 3
            : 2;
    const pointsAwarded = Math.round(butterflySize * priorityMultiplier);

    // 5. Create the butterfly
    await this.prisma.butterfly.create({
      data: {
        taskId: task.id,
        origin,
        size: butterflySize,
        pointsAwarded,
        isCaught: false,
      },
    });

    // Return the task with butterfly included
    return this.prisma.task.findUnique({
      where: { id: task.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        butterfly: {
          select: {
            id: true,
            origin: true,
            size: true,
            isCaught: true,
            pointsAwarded: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    userId: string,
    taskData: {
      title?: string;
      description?: string;
      dueDate?: string;
      completedAt?: string | null;
    },
  ) {
    // Verify the task belongs to the user
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: {
        butterfly: true,
      },
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    // Check if task is being completed (completedAt is being set and wasn't set before)
    const isCompleting =
      taskData.completedAt !== undefined &&
      taskData.completedAt !== null &&
      task.completedAt === null;

    // If completing the task, award points and mark butterfly as caught
    if (isCompleting && task.butterfly && !task.butterfly.isCaught) {
      const pointsToAward = task.butterfly.pointsAwarded;

      // Update user points
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          userPoints: {
            increment: pointsToAward,
          },
        },
      });

      // Mark butterfly as caught
      await this.prisma.butterfly.update({
        where: { id: task.butterfly.id },
        data: {
          isCaught: true,
          caughtAt: new Date(),
        },
      });
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(taskData.title !== undefined && { title: taskData.title }),
        ...(taskData.description !== undefined && {
          description: taskData.description || null,
        }),
        ...(taskData.dueDate !== undefined && {
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        }),
        ...(taskData.completedAt !== undefined && {
          completedAt: taskData.completedAt
            ? new Date(taskData.completedAt)
            : null,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        butterfly: {
          select: {
            id: true,
            origin: true,
            size: true,
            isCaught: true,
            pointsAwarded: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    // Verify the task belongs to the user
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
