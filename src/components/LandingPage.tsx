import React, { useState } from 'react';
import { Users, Plus, LogIn } from 'lucide-react';
import { FAQ } from './FAQ';
import { GameConfigPanel } from './GameConfig';
import { GameConfig } from '../types';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';

interface LandingPageProps {
  onCreateGame: (config: GameConfig, playerName: string) => void;
  onJoinGame: (code: string) => void;
}

export function LandingPage({ onCreateGame, onJoinGame }: LandingPageProps) {
  const [gameCode, setGameCode] = useState('');
  const [gameCodeError, setGameCodeError] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [config, setConfig] = useState<GameConfig>({
    numSpies: 1,
    timeLimit: 480,
    country: 'Canada'
  });

  const handleCreateGame = () => {
    if (!showConfig) {
      setShowConfig(true);
      return;
    }

    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setNameError('Please enter your name');
      return;
    }

    onCreateGame(config, trimmedName);
  };

  const handleJoinAttempt = async (code: string) => {
    if (code.length !== 6) {
      setGameCodeError('Game code must be 6 characters');
      return;
    }
    
    try {
      const gameRef = ref(db, `games/${code}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        setGameCodeError('Game not found');
        return;
      }

      setGameCodeError('');
      onJoinGame(code);
    } catch (error) {
      setGameCodeError('Error joining game');
      console.error('Error checking game:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showConfig && playerName) {
        handleCreateGame();
      } else if (gameCode) {
        handleJoinAttempt(gameCode);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-purple-400">Spyfall</h1>
          <p className="text-xl text-gray-400">The ultimate social deduction game</p>
        </header>

        <div className="max-w-md mx-auto mb-12">
          {showConfig ? (
            <div className="space-y-6">
              <GameConfigPanel config={config} onConfigChange={setConfig} />
              <div className="space-y-4">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setNameError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 border
                    ${nameError ? 'border-red-500' : 'border-gray-700'}`}
                />
                {nameError && (
                  <div className="text-red-400 text-sm">{nameError}</div>
                )}
                <button
                  onClick={handleCreateGame}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Game
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleCreateGame}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Create New Game
              </button>

              <div className="relative">
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => {
                    setGameCode(e.target.value.toUpperCase());
                    setGameCodeError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Game Code"
                  className={`w-full px-6 py-4 bg-gray-800 rounded-lg text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 
                    ${gameCodeError ? 'border-red-500' : 'border-gray-600/50'}`}
                />
                {gameCodeError && (
                  <div className="absolute -bottom-6 left-0 text-red-400 text-sm">
                    {gameCodeError}
                  </div>
                )}
                <button
                  onClick={() => gameCode && handleJoinAttempt(gameCode)}
                  disabled={!gameCode}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 
                    rounded-lg hover:bg-blue-700 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogIn className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-12">
          <button
            onClick={() => setShowFAQ(!showFAQ)}
            className="text-purple-400 hover:text-purple-300 transition-colors text-lg flex items-center gap-2 mx-auto"
          >
            <Users className="w-5 h-5" />
            {showFAQ ? 'Hide How to Play' : 'Show How to Play'}
          </button>
        </div>

        {showFAQ && <FAQ />}
      </div>
    </div>
  );
}