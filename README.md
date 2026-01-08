# TaskFlutter

Created by: Jason, Jacob

## Project Links

- Deployed Site: https://group-project.jmartgmz.workers.dev/
- Repository: https://github.com/UD-CISC474-F25/f25-cisc474-blue
- Backend: https://f25-cisc474-blue.onrender.com/

## Site Concept

TaskFlutter is a gamified task management application that transforms productivity into an engaging experience. The core concept revolves around "catching butterflies" to complete tasks. Users create tasks, and each task is represented as a butterfly that can be caught in an interactive game. When users catch a butterfly, they complete the associated task and earn points. These points can then be spent in a shop to customize their butterfly collection and unlock new features. The application combines traditional task management (creating, editing, organizing tasks with priorities, due dates, and descriptions) with gamification elements to make productivity fun and rewarding.

## Major Features (Fully Working)

### User Authentication

- Auth0 integration for secure login/logout
- User profile management with first name and last name updates
- Persistent user sessions

### Task Management

- Create tasks with title, description, priority, size, due date, and estimated time
- Edit existing tasks
- Delete tasks
- Mark tasks as complete/incomplete
- View all tasks with search functionality
- Task filtering and organization
- Visual indicators for overdue tasks and due dates

### Butterfly Catching Game

- Interactive butterfly catching interface
- Each active task is represented as a flying butterfly
- Click butterflies to catch them and complete tasks
- Visual feedback with completion animations
- Points earned displayed upon task completion

### Points System

- Earn points for completing tasks (points vary by task size)
- Points stored in database and synced across sessions
- Points display on home page, completed page, and shop
- Points automatically updated when tasks are completed

### Shop System

- Browse available shop items
- Purchase items using earned points
- Create custom shop items (admin functionality)
- Delete shop items
- Points balance validation before purchases

### Completed Tasks Page

- View all completed tasks
- Statistics showing total tasks completed and total points earned
- Current points balance display
- Undo task completion functionality
- Separate display for recent tasks and archived tasks

### Home Dashboard

- Welcome message with user information
- Active tasks count
- Current points display
- Quick actions (create task, view all tasks)
- List of active tasks with due date indicators

### Settings Page

- Update user profile information (first name, last name)
- View account details
- Logout functionality

### Database Integration

- Full CRUD operations for tasks
- User data persistence
- Points tracking in database
- Shop items management
- Butterfly data storage

## Incomplete Features

### Task Reminders

- Status: Not implemented in frontend
- What's Working: The database schema includes a Reminder model with relationships to tasks, but there is no user interface or functionality to create, view, or manage reminders
- What's Missing: No reminder creation form, no reminder notifications, no reminder display in the UI
