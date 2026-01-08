import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { TaskPriority, TaskSize } from '../types';

interface TaskFormProps {
  initialData?: {
    title: string;
    description?: string;
    size: TaskSize;
    priority: TaskPriority;
    estimatedMinutes?: number;
    dueDate?: string;
  };
  onSubmit: (data: {
    title: string;
    description?: string;
    size: TaskSize;
    priority: TaskPriority;
    estimatedMinutes?: number;
    dueDate?: string;
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Task',
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [size, setSize] = useState<TaskSize>(initialData?.size || 'medium');
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || 'medium',
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<string>(
    initialData?.estimatedMinutes?.toString() || '',
  );
  const [dueDate, setDueDate] = useState<string>(
    initialData?.dueDate?.split('T')[0] || '',
  );

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      size,
      priority,
      estimatedMinutes: estimatedMinutes
        ? parseInt(estimatedMinutes, 10)
        : undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{submitLabel}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as TaskSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-2 rounded font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
