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
      flex items-center gap-3 px-4 py-2 border font-mono
      ${isLowTime ? 'bg-red-900/50 border-red-600 animate-pulse shadow-red-900/50' : 'bg-black/50 border-gray-700'}
      backdrop-blur-sm shadow-lg transition-all duration-300
    `}>
      <Timer className={`w-4 h-4 ${isLowTime ? 'text-red-400' : 'text-amber-400'}`} />
      <span className={`
        text-lg font-mono font-bold tracking-wider
        ${isLowTime ? 'text-red-400' : 'text-gray-200'}
      `}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      <div className="text-xs text-gray-500 font-mono">
        {isLowTime ? 'CRITICAL' : 'REMAINING'}
      </div>
    </div>
  );
}