import React from 'react';
import { ArrowLeft, Crown, Share2, Copy, UserX } from 'lucide-react';
import { GameState, Player } from '../types';

interface LobbyScreenProps {
  gameState: GameState;
  currentPlayer: Player | null;
  copySuccess: boolean;
  onShareLink: () => void;
  onBack: () => void;
  onStartGame: () => void;
  onKickPlayer: (playerId: string) => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  gameState,
  currentPlayer,
  copySuccess,
  onShareLink,
  onBack,
  onStartGame,
  onKickPlayer
}) => {
  const canStartGame = gameState.players.length > 0;
  const hasLeader = gameState.players.some(p => p.isLeader);
  const isLeader = currentPlayer?.isLeader;

  return (
    <div className="max-w-2xl mx-auto">
      <header className="text-center mb-8 relative">
        <button
          onClick={onBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-400 transition-colors"
          aria-label="Back to main menu"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-bold mb-2 text-red-400 font-mono tracking-wider">SPYFALL</h1>
        <div className="text-gray-400 font-mono flex items-center justify-center gap-4">
          MISSION CODE: <span className="font-mono text-xl text-amber-400 tracking-widest">{gameState.id}</span>
          <button
            onClick={onShareLink}
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-amber-400 transition-colors font-mono text-sm"
            title="Share game link"
          >
            {copySuccess ? (
              <>
                <Copy className="w-4 h-4 text-green-400" />
                COPIED
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                SHARE
              </>
            )}
          </button>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mt-4"></div>
      </header>

      <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-red-900/50 p-6 shadow-2xl shadow-red-900/20 relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-red-900/50 flex items-center px-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="ml-4 text-xs text-gray-400 font-mono">MISSION_LOBBY.exe</div>
        </div>
        <div className="pt-4">
          {gameState.isPlaying ? (
            <>
              <h2 className="text-lg font-semibold mb-4 text-red-400 font-mono tracking-wide">MISSION STATUS</h2>
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800">
                <div className="text-red-400 font-mono text-sm mb-2">OPERATION IN PROGRESS</div>
                <div className="text-gray-300 text-sm font-mono">
                  {gameState.players.length} agents are currently on mission. You will join the next operation.
                </div>
              </div>

              <h3 className="text-md font-semibold mb-3 text-amber-400 font-mono tracking-wide">ACTIVE OPERATIVES</h3>
              <div className="space-y-2 mb-6">
                {gameState.players.map(player => (
                  <div key={player.id} className="flex items-center gap-3 bg-black/20 border border-gray-700 p-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-200 font-mono">{player.name}</span>
                    {player.isLeader && (
                      <span className="flex items-center gap-1 text-amber-500 text-sm font-mono border border-amber-700 px-2 py-1 bg-amber-900/20">
                        <Crown className="w-3.5 h-3.5" />
                        COMMANDER
                      </span>
                    )}
                    <span className="text-red-400 text-xs font-mono">ON MISSION</span>
                  </div>
                ))}
              </div>

              {gameState.waitingPlayers && gameState.waitingPlayers.length > 0 && (
                <>
                  <h3 className="text-md font-semibold mb-3 text-green-400 font-mono tracking-wide">STANDBY AGENTS</h3>
                  <div className="space-y-2">
                    {gameState.waitingPlayers.map(player => (
                      <div key={player.id} className="flex items-center gap-3 bg-black/20 border border-gray-700 p-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-200 font-mono">{player.name}</span>
                        <span className="text-green-400 text-xs font-mono">READY</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4 text-red-400 font-mono tracking-wide">AGENT ROSTER</h2>
              <div className="space-y-2">
                <div className="text-sm text-amber-400 mb-3 font-mono">OPERATIVES ({gameState.players.length}/12)</div>
                {gameState.players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-black/20 border border-gray-700 p-3 hover:border-red-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-200 font-mono">{player.name}</span>
                      {player.isLeader && (
                        <span className="flex items-center gap-1 text-amber-500 text-sm font-mono border border-amber-700 px-2 py-1 bg-amber-900/20">
                          <Crown className="w-3.5 h-3.5" />
                          COMMANDER
                        </span>
                      )}
                    </div>
                    {currentPlayer?.isLeader && !player.isLeader && (
                      <button
                        onClick={() => onKickPlayer(player.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors border border-red-800 hover:border-red-600 bg-red-900/20"
                        aria-label="Remove agent"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {canStartGame && hasLeader && isLeader && !gameState.isPlaying && (
            <button
              onClick={onStartGame}
              className="w-full mt-6 px-4 py-3 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 text-lg shadow-lg shadow-red-900/20"
            >
              INITIATE MISSION
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 