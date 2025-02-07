import React from 'react';
import { User, Crown, Vote } from 'lucide-react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  onVotePlayer: () => void;
  showVoteButton: boolean;
  hasVoted?: boolean;
}

export function PlayerCard({
  player,
  isCurrentTurn,
  onVotePlayer,
  showVoteButton,
  hasVoted
}: PlayerCardProps) {
  return (
    <div className={`
      relative p-6 rounded-xl border transition-all duration-300
      ${isCurrentTurn 
        ? 'bg-purple-900/50 border-purple-500/50 shadow-lg shadow-purple-900/20' 
        : 'bg-gray-800/50 border-gray-700/50'}
      backdrop-blur-sm hover:scale-102 hover:shadow-xl
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`
            p-2 rounded-lg
            ${isCurrentTurn ? 'bg-purple-500/20' : 'bg-gray-700/50'}
          `}>
            <User className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <span className="text-lg font-medium text-gray-200">{player.name}</span>
            {player.isLeader && (
              <div className="flex items-center gap-1 text-yellow-500 text-sm mt-0.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Leader</span>
              </div>
            )}
          </div>
        </div>
        
        {showVoteButton && (
          <button
            onClick={onVotePlayer}
            className={`
              p-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2
              ${hasVoted 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
            `}
          >
            <Vote className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              {hasVoted ? 'Voted' : 'Vote'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}