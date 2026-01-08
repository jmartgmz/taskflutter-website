import { prisma } from './client';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to read JSON files
function readJsonFile(filename: string) {
  const filePath = path.join(__dirname, '..', 'seed-data', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// Load seed data from JSON files
const DEFAULT_USERS = readJsonFile('users.json');
const DEFAULT_TASKS = readJsonFile('tasks.json');
const DEFAULT_BUTTERFLIES = readJsonFile('butterflies.json');
const DEFAULT_REMINDERS = readJsonFile('reminders.json');
const DEFAULT_BUTTERFLY_CUSTOMIZATIONS = readJsonFile(
  'butterfly-customizations.json',
);
const DEFAULT_SHOP_ITEMS = readJsonFile('shop-items.json');

async function main() {
  console.log('Seeding butterfly to-do database...');

  // Create users
  const users = new Map();
  for (const userData of DEFAULT_USERS) {
    const user = await prisma.user.upsert({
      where: { email: userData.email! },
      update: userData,
      create: userData,
    });
    users.set(userData.email, user);
    console.log(
      `Created/updated user: ${user.name || user.firstName + ' ' + user.lastName}`,
    );
  }

  // Create tasks
  const tasks = new Map();
  for (const taskData of DEFAULT_TASKS) {
    const user = users.get(taskData.userEmail);
    const { userEmail, dueDate, completedAt, ...taskInfo } = taskData;

    const task = await prisma.task.upsert({
      where: {
        id: `${user.id}-${taskData.title}`, // Temporary unique key
      },
      update: {
        ...taskInfo,
        userId: user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
      create: {
        ...taskInfo,
        userId: user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });
    tasks.set(`${taskData.userEmail}-${taskData.title}`, task);
    console.log(
      `Created/updated task: ${task.title} for ${user.name || user.firstName}`,
    );
  }

  // Create butterflies
  for (const butterflyData of DEFAULT_BUTTERFLIES) {
    const task = tasks.get(
      `${butterflyData.userEmail}-${butterflyData.taskTitle}`,
    );
    const { taskTitle, userEmail, caughtAt, ...butterflyInfo } = butterflyData;

    await prisma.butterfly.upsert({
      where: {
        taskId: task.id,
      },
      update: {
        ...butterflyInfo,
        caughtAt: caughtAt ? new Date(caughtAt) : null,
      },
      create: {
        ...butterflyInfo,
        taskId: task.id,
        caughtAt: caughtAt ? new Date(caughtAt) : null,
      },
    });
    console.log(`Created/updated butterfly for task: ${task.title}`);
  }

  // Create reminders
  for (const reminderData of DEFAULT_REMINDERS) {
    const task = tasks.get(
      `${reminderData.userEmail}-${reminderData.taskTitle}`,
    );
    const { taskTitle, userEmail, reminderTime, ...reminderInfo } =
      reminderData;

    await prisma.reminder.create({
      data: {
        ...reminderInfo,
        taskId: task.id,
        reminderTime: new Date(reminderTime),
      },
    });
    console.log(`Created reminder for task: ${task.title}`);
  }

  // Create butterfly customizations
  for (const customizationData of DEFAULT_BUTTERFLY_CUSTOMIZATIONS) {
    const user = users.get(customizationData.userEmail);
    const { userEmail, ...customizationInfo } = customizationData;

    await prisma.butterflyCustomization.upsert({
      where: {
        userId: user.id,
      },
      update: customizationInfo,
      create: {
        ...customizationInfo,
        userId: user.id,
      },
    });
    console.log(
      `Created/updated customization for: ${user.name || user.firstName}`,
    );
  }

  // Create shop items
  for (const shopItemData of DEFAULT_SHOP_ITEMS) {
    const user = users.get(shopItemData.userEmail);
    const { userEmail, ...shopItemInfo } = shopItemData;

    await prisma.shopItem.create({
      data: {
        ...shopItemInfo,
        userId: user.id,
      },
    });
    console.log(
      `Created shop item: ${shopItemInfo.itemName} for ${user.name || user.firstName}`,
    );
  }

  console.log('Butterfly to-do database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
