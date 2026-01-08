import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { getPointsForTaskSize } from '../utils/taskUtils';
import { Butterfly } from '../components/Butterfly';
import { PointsDisplay } from '../components/PointsDisplay';
import { TaskCard } from '../components/TaskCard';
import { Header } from '../components/Header';
import type { Task } from '../types';

export const Route = createFileRoute('/catch')({
  component: CatchPage,
});

function CatchPage() {
  const { getActiveTasks, completeTask, points } = useTasks();
  const [caughtTask, setCaughtTask] = useState<Task | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const activeTasks = getActiveTasks();
  const [flyingButterflies, setFlyingButterflies] = useState<
    Array<{ task: Task; x: number; y: number; id: string }>
  >([]);

  // Initialize butterflies with random positions
  useEffect(() => {
    if (activeTasks.length > 0 && flyingButterflies.length === 0) {
      const butterflies = activeTasks.map((task) => ({
        task,
        x: Math.random() * 80 + 10, // 10-90%
        y: Math.random() * 60 + 20, // 20-80%
        id: task.id,
      }));
      setFlyingButterflies(butterflies);
    }
  }, [activeTasks, flyingButterflies.length]);

  const handleCatchButterfly = (taskId: string) => {
    const task = activeTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Calculate points
    const taskPoints = getPointsForTaskSize(task.size);
    setPointsEarned(taskPoints);
    setCaughtTask(task);
    setShowCompletion(true);

    // Complete the task
    completeTask(taskId);

    // Remove caught butterfly
    setFlyingButterflies((prev) => prev.filter((b) => b.id !== taskId));
  };

  const handleContinue = () => {
    setShowCompletion(false);
    setCaughtTask(null);
    setPointsEarned(0);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      <Header />
      {/* Sky background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200 rounded-full blur-3xl" />
        <div className="absolute top-40 right-40 w-40 h-40 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-40 w-36 h-36 bg-pink-200 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Catch a Butterfly! 🦋
          </h1>
          <p className="text-gray-600 mb-4">
            Click on a butterfly to catch it and complete the task!
          </p>
          <PointsDisplay points={points} className="inline-flex" />
        </div>

        {activeTasks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-12 text-center border border-purple-100">
            <p className="text-xl text-gray-600 mb-4">
              No active tasks to catch! Create some tasks first.
            </p>
          </div>
        ) : (
          <>
            {/* Butterfly catching area */}
            <div className="relative bg-white/60 backdrop-blur-md rounded shadow-xl p-8 min-h-[500px] mb-8 border border-purple-100">
              {flyingButterflies.length > 0 ? (
                <div className="relative h-full">
                  {flyingButterflies.map((butterfly) => (
                    <div
                      key={butterfly.id}
                      className="absolute cursor-pointer transition-transform hover:scale-110"
                      style={{
                        left: `${butterfly.x}%`,
                        top: `${butterfly.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={() => handleCatchButterfly(butterfly.id)}
                      title={butterfly.task.title}
                    >
                      <Butterfly size={butterfly.task.size} animated={true} />
                    </div>
                  ))}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-sm">
                    Click on a butterfly to catch it!
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">
                      All butterflies caught! Great job! 🎉
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Task list sidebar */}
            <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Available Tasks
              </h2>
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div key={task.id} className="border-b pb-2">
                    <TaskCard task={task} showActions={false} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Completion Modal */}
        {showCompletion && caughtTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-8 max-w-md w-full mx-4 shadow-2xl text-center border-2 border-purple-200">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Butterfly Caught! 🦋
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                You completed: <strong>{caughtTask.title}</strong>
              </p>
              <div className="bg-linear-to-r from-yellow-400 to-orange-400 rounded-full px-6 py-3 inline-block mb-6">
                <span className="text-white font-bold text-2xl">
                  +{pointsEarned} points!
                </span>
              </div>
              <button
                onClick={handleContinue}
                className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
              >
                Continue Catching
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
