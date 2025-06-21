import React from 'react';
import { User, Crown, Vote, UserX } from 'lucide-react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  onVotePlayer: () => void;
  onKickPlayer?: () => void;
  showVoteButton: boolean;
  hasVoted?: boolean;
  isCurrentPlayer?: boolean;
  canKick?: boolean;
}

export function PlayerCard({
  player,
  isCurrentTurn,
  onVotePlayer,
  onKickPlayer,
  showVoteButton,
  hasVoted,
  isCurrentPlayer,
  canKick
}: PlayerCardProps) {
  return (
    <div className="relative p-4 border transition-all duration-300 font-mono bg-gray-900/80 border-gray-700 backdrop-blur-sm hover:border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 border bg-black/50 border-gray-700">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-sm text-gray-200">
                {player.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {canKick && !player.isLeader && (
            <button
              onClick={onKickPlayer}
              className="p-2 bg-red-800 hover:bg-red-700 border border-red-600 transition-colors duration-200"
              title="Remove agent"
            >
              <UserX className="w-3 h-3 text-white" />
            </button>
          )}
          {showVoteButton && (
            <button
              onClick={onVotePlayer}
              className={`
                p-2 transition-colors duration-200 flex items-center gap-1 border font-mono text-xs
                ${hasVoted 
                  ? 'bg-green-800 border-green-600 hover:bg-green-700' 
                  : 'bg-red-800 border-red-600 hover:bg-red-700'}
              `}
            >
              <Vote className="w-3 h-3 text-white" />
              <span className="text-white">
                {hasVoted ? 'VOTED' : 'VOTE'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}