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
  const width = 50 * multiplier;
  const height = 50 * multiplier;
  const butterflyColor = color || defaultColors[size];

  const animationClass = animated ? 'animate-bounce hover:scale-125' : '';

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ${animationClass} ${className}`}
      onClick={onClick}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Butterfly body */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
        style={{
          width: `${width * 0.15}px`,
          height: `${height * 0.7}px`,
          backgroundColor: '#1f2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
      
      {/* Antennae */}
      <div
        className="absolute z-20"
        style={{
          left: `${width * 0.42}px`,
          top: `${height * 0.1}px`,
          width: '2px',
          height: `${height * 0.2}px`,
          backgroundColor: '#1f2937',
          transform: 'rotate(-20deg)',
          transformOrigin: 'bottom',
        }}
      />
      <div
        className="absolute z-20"
        style={{
          left: `${width * 0.56}px`,
          top: `${height * 0.1}px`,
          width: '2px',
          height: `${height * 0.2}px`,
          backgroundColor: '#1f2937',
          transform: 'rotate(20deg)',
          transformOrigin: 'bottom',
        }}
      />
      
      {/* Top left wing */}
      <div
        className="absolute rounded-full shadow-lg"
        style={{
          left: `${width * 0.1}px`,
          top: `${height * 0.15}px`,
          width: `${width * 0.4}px`,
          height: `${height * 0.5}px`,
          backgroundColor: butterflyColor,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          transform: 'rotate(-15deg)',
          boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)`,
        }}
      />
      
      {/* Top right wing */}
      <div
        className="absolute rounded-full shadow-lg"
        style={{
          right: `${width * 0.1}px`,
          top: `${height * 0.15}px`,
          width: `${width * 0.4}px`,
          height: `${height * 0.5}px`,
          backgroundColor: butterflyColor,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          transform: 'rotate(15deg)',
          boxShadow: `inset 10px -10px 20px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)`,
        }}
      />
      
      {/* Bottom left wing */}
      <div
        className="absolute rounded-full shadow-lg"
        style={{
          left: `${width * 0.15}px`,
          bottom: `${height * 0.1}px`,
          width: `${width * 0.35}px`,
          height: `${height * 0.45}px`,
          backgroundColor: butterflyColor,
          borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          transform: 'rotate(10deg)',
          opacity: 0.9,
          boxShadow: `inset -8px 8px 16px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)`,
        }}
      />
      
      {/* Bottom right wing */}
      <div
        className="absolute rounded-full shadow-lg"
        style={{
          right: `${width * 0.15}px`,
          bottom: `${height * 0.1}px`,
          width: `${width * 0.35}px`,
          height: `${height * 0.45}px`,
          backgroundColor: butterflyColor,
          borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          transform: 'rotate(-10deg)',
          opacity: 0.9,
          boxShadow: `inset 8px 8px 16px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)`,
        }}
      />
      
      {/* Pattern dots */}
      {pattern === 'dots' && (
        <>
          <div
            className="absolute rounded-full bg-white z-10"
            style={{
              width: `${width * 0.12}px`,
              height: `${width * 0.12}px`,
              left: `${width * 0.18}px`,
              top: `${height * 0.25}px`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
          <div
            className="absolute rounded-full bg-white z-10"
            style={{
              width: `${width * 0.12}px`,
              height: `${width * 0.12}px`,
              right: `${width * 0.18}px`,
              top: `${height * 0.25}px`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
          <div
            className="absolute rounded-full bg-white z-10"
            style={{
              width: `${width * 0.08}px`,
              height: `${width * 0.08}px`,
              left: `${width * 0.22}px`,
              top: `${height * 0.42}px`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
          <div
            className="absolute rounded-full bg-white z-10"
            style={{
              width: `${width * 0.08}px`,
              height: `${width * 0.08}px`,
              right: `${width * 0.22}px`,
              top: `${height * 0.42}px`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
        </>
      )}
    </div>
  );
}
