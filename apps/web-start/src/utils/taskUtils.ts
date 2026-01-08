import type { TaskSize } from '../types';

export function getSizeMultiplier(size: TaskSize): number {
  switch (size) {
    case 'small':
      return 0.8;
    case 'medium':
      return 1.0;
    case 'large':
      return 1.3;
    case 'extra-large':
      return 1.6;
    default:
      return 1.0;
  }
}

export function getPointsForTaskSize(size: TaskSize): number {
  switch (size) {
    case 'small':
      return 10;
    case 'medium':
      return 25;
    case 'large':
      return 50;
    case 'extra-large':
      return 100;
    default:
      return 10;
  }
}
