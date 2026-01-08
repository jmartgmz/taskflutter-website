import { Sparkles } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
  className?: string;
}

export function PointsDisplay({ points, className = '' }: PointsDisplayProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 rounded shadow-md ${className}`}
    >
      <Sparkles className="w-5 h-5 text-white" />
      <span className="text-white font-bold text-lg">{points}</span>
    </div>
  );
}
