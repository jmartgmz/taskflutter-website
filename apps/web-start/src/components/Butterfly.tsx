import { getSizeMultiplier } from '../utils/taskUtils';
import type { TaskSize } from '../types';

interface ButterflyProps {
  size: TaskSize;
  color?: string;
  pattern?: string;
  className?: string;
  onClick?: () => void;
  animated?: boolean;
}

const defaultColors = {
  small: '#60A5FA', // blue
  medium: '#34D399', // green
  large: '#FBBF24', // orange
  'extra-large': '#F87171', // red
};

export function Butterfly({
  size,
  color,
  pattern = 'dots',
  className = '',
  onClick,
  animated = true,
}: ButterflyProps) {
  const multiplier = getSizeMultiplier(size);
  const width = 40 * multiplier;
  const height = 40 * multiplier;
  const butterflyColor = color || defaultColors[size];

  const animationClass = animated ? 'animate-pulse hover:scale-110' : '';

  return (
    <div
      className={`relative cursor-pointer transition-transform ${animationClass} ${className}`}
      onClick={onClick}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Butterfly body */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
        style={{
          width: `${width * 0.2}px`,
          height: `${height * 0.6}px`,
          backgroundColor: butterflyColor,
          opacity: 0.8,
        }}
      />
      {/* Top left wing */}
      <div
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: `${width * 0.5}px`,
          height: `${height * 0.5}px`,
          backgroundColor: butterflyColor,
          opacity: 0.7,
          clipPath: 'ellipse(50% 50% at 50% 0%)',
        }}
      />
      {/* Top right wing */}
      <div
        className="absolute right-0 top-0 rounded-full"
        style={{
          width: `${width * 0.5}px`,
          height: `${height * 0.5}px`,
          backgroundColor: butterflyColor,
          opacity: 0.7,
          clipPath: 'ellipse(50% 50% at 50% 0%)',
        }}
      />
      {/* Bottom left wing */}
      <div
        className="absolute left-0 bottom-0 rounded-full"
        style={{
          width: `${width * 0.4}px`,
          height: `${height * 0.4}px`,
          backgroundColor: butterflyColor,
          opacity: 0.6,
          clipPath: 'ellipse(50% 50% at 50% 100%)',
        }}
      />
      {/* Bottom right wing */}
      <div
        className="absolute right-0 bottom-0 rounded-full"
        style={{
          width: `${width * 0.4}px`,
          height: `${height * 0.4}px`,
          backgroundColor: butterflyColor,
          opacity: 0.6,
          clipPath: 'ellipse(50% 50% at 50% 100%)',
        }}
      />
      {/* Pattern dots */}
      {pattern === 'dots' && (
        <>
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: `${width * 0.1}px`,
              height: `${width * 0.1}px`,
              left: `${width * 0.25}px`,
              top: `${height * 0.15}px`,
            }}
          />
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: `${width * 0.1}px`,
              height: `${width * 0.1}px`,
              right: `${width * 0.25}px`,
              top: `${height * 0.15}px`,
            }}
          />
        </>
      )}
    </div>
  );
}
