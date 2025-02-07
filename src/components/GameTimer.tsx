import React from 'react';
import { Timer } from 'lucide-react';

interface GameTimerProps {
  timeRemaining: number;
}

export function GameTimer({ timeRemaining }: GameTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining <= 60; // Last minute

  return (
    <div className={`
      flex items-center gap-3 px-6 py-3 rounded-xl
      ${isLowTime ? 'bg-red-900/50 animate-pulse' : 'bg-gray-800/50'}
      backdrop-blur-sm shadow-lg border border-gray-700/50
    `}>
      <Timer className={`w-6 h-6 ${isLowTime ? 'text-red-400' : 'text-gray-400'}`} />
      <span className={`
        text-2xl font-mono font-bold
        ${isLowTime ? 'text-red-400' : 'text-gray-200'}
      `}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}