import confetti from 'canvas-confetti';
import { playSound } from './sounds';

export const triggerCelebration = () => {
  playSound('welcome');
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#00ff88', '#ffd700', '#ffffff'],
    disableForReducedMotion: true
  });
};
