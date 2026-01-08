import { Calendar, CheckCircle2, Clock, Edit, Trash2 } from 'lucide-react';
import type { Task, TaskSize } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const sizeColors: Record<TaskSize, string> = {
  small: 'bg-blue-100 border-blue-300',
  medium: 'bg-green-100 border-green-300',
  large: 'bg-orange-100 border-orange-300',
  'extra-large': 'bg-red-100 border-red-300',
};

const priorityColors = {
  low: 'text-gray-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

export function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  showActions = true,
}: TaskCardProps) {
  return (
    <div
      className={`border-2 rounded p-4 shadow-md transition-all hover:shadow-lg ${
        task.completed
          ? 'bg-gray-100 border-gray-300 opacity-60'
          : sizeColors[task.size]
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`font-semibold text-lg ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                task.size === 'small'
                  ? 'bg-blue-200 text-blue-800'
                  : task.size === 'medium'
                    ? 'bg-green-200 text-green-800'
                    : task.size === 'large'
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-red-200 text-red-800'
              }`}
            >
              {task.size}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-gray-700 mb-2">{task.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {task.estimatedMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{task.estimatedMinutes} min</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        {showActions && !task.completed && (
          <div className="flex gap-2 ml-4">
            {onComplete && (
              <button
                onClick={() => onComplete(task.id)}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                title="Complete task"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(task.id)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Edit task"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
