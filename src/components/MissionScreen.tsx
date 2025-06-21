import React from 'react';
import { Users, XCircle } from 'lucide-react';
import { GameState, Player } from '../types';
import { GameTimer } from './GameTimer';
import { PlayerCard } from './PlayerCard';
import { RoleInfo } from './RoleInfo';
import { LocationGrid } from './LocationGrid';

interface MissionScreenProps {
  gameState: GameState;
  currentPlayer: Player;
  onKickPlayer: (playerId: string) => void;
  onAbortMission: () => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({
  gameState,
  currentPlayer,
  onKickPlayer,
  onAbortMission
}) => {
  const isLeader = currentPlayer?.isLeader;

  return (
    <div className="max-w-6xl mx-auto">
      {currentPlayer && gameState.location && (
        <RoleInfo
          isSpy={currentPlayer.isSpy || false}
          location={gameState.location}
          role={currentPlayer.role || ''}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-6">
          <GameTimer timeRemaining={gameState.timeRemaining} />
          <div className="h-8 w-px bg-red-800/50" />
          <div className="flex items-center gap-2 text-gray-400 font-mono border border-gray-700 px-3 py-1 bg-black/20">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-sm">{gameState.players.length} AGENTS</span>
          </div>
        </div>
        {isLeader && (
          <button
            onClick={onAbortMission}
            className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 shadow-lg shadow-red-900/20"
            aria-label="Abort Mission"
          >
            <XCircle className="w-4 h-4" />
            ABORT MISSION
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {gameState.players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            isCurrentTurn={player.id === gameState.currentTurn}
            onVotePlayer={() => {
              /* Voting logic can be added here */
            }}
            onKickPlayer={isLeader && !player.isLeader ? () => onKickPlayer(player.id) : undefined}
            showVoteButton={gameState.votingFor !== undefined}
            hasVoted={gameState.votes[player.id]}
            isCurrentPlayer={currentPlayer.id === player.id}
            canKick={isLeader && !player.isLeader}
          />
        ))}
      </div>

      <LocationGrid />
    </div>
  );
}; 