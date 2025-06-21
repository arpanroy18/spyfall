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
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
      
      {/* Scanning lines effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse delay-2000"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse delay-500"></div>
      </div>

      {/* Subtle radar sweep effect */}
      <div className="absolute top-10 right-10 w-32 h-32 opacity-10">
        <div className="w-full h-full border border-red-500 rounded-full"></div>
        <div className="absolute top-2 left-2 w-28 h-28 border border-red-500 rounded-full"></div>
        <div className="absolute top-4 left-4 w-24 h-24 border border-red-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-red-500 origin-bottom transform -translate-x-1/2 animate-spin" style={{animationDuration: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <div className="inline-block">
            <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent tracking-wider">
              SPYFALL
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mb-6"></div>
            <div className="text-xs text-red-400/80 font-mono tracking-[0.3em] mb-2">CLASSIFIED</div>
          </div>
          <p className="text-xl text-gray-400 font-light tracking-wide">INFILTRATE • DECEIVE • SURVIVE</p>
          <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500 font-mono">
            <div className="flex items-center gap-2 border border-gray-800 px-3 py-1 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>3-12 AGENTS</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-800 px-3 py-1 rounded">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-300"></div>
              <span>5-10 MINUTES</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-800 px-3 py-1 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-700"></div>
              <span>SECURE ACCESS</span>
            </div>
          </div>
        </header>

        <section className="max-w-lg mx-auto mb-16" aria-label="game-controls">
          <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-red-900/50 rounded-lg p-8 shadow-2xl shadow-red-900/20 relative">
            {/* Terminal-style header */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-red-900/50 rounded-t-lg flex items-center px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4 text-xs text-gray-400 font-mono">SECURE_TERMINAL.exe</div>
            </div>
            
            <div className="pt-4">
              {showConfig ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 text-red-400 font-mono tracking-wide">MISSION PARAMETERS</h3>
                    <p className="text-gray-500 text-sm font-mono">Configure operational details</p>
                  </div>
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
                      placeholder="Enter codename"
                      className={`w-full px-4 py-3 bg-black/50 border text-white placeholder-gray-500 font-mono
                        focus:outline-none focus:ring-1 transition-all duration-300
                        ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-amber-500 hover:border-gray-600'}`}
                    />
                    {nameError && (
                      <div className="text-red-400 text-sm font-mono">{nameError}</div>
                    )}
                    <button
                      onClick={handleCreateGame}
                      className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-900/20"
                    >
                      <Plus className="w-4 h-4" />
                      INITIATE MISSION
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold mb-2 text-red-400 font-mono tracking-wide">ACCESS TERMINAL</h3>
                    <p className="text-gray-500 text-sm font-mono">Select operation mode</p>
                  </div>
                  
                  <button
                    onClick={handleCreateGame}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-900/20"
                  >
                    <Plus className="w-5 h-5" />
                    CREATE NEW GAME
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900 text-gray-500 font-mono">OR</span>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={gameCode}
                      onChange={(e) => {
                        setGameCode(e.target.value.toUpperCase());
                        setGameCodeError('');
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="ENTER ACCESS CODE"
                      className={`w-full px-4 py-3 pr-12 bg-black/50 border text-white placeholder-gray-500 font-mono tracking-widest text-center
                        focus:outline-none focus:ring-1 transition-all duration-300
                        ${gameCodeError ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-amber-500 hover:border-gray-600'}`}
                    />
                    {gameCodeError && (
                      <div className="absolute -bottom-6 left-0 text-red-400 text-sm font-mono">
                        {gameCodeError}
                      </div>
                    )}
                    <button
                      onClick={() => gameCode && handleJoinAttempt(gameCode)}
                      disabled={!gameCode}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-amber-700 hover:bg-amber-600 border border-amber-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-700"
                    >
                      <LogIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <article className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-red-400 font-mono tracking-wider">
                MISSION BRIEFING
              </h2>
              <div className="bg-gray-900/50 border border-gray-700 p-6 font-mono text-left text-gray-300 max-w-2xl mx-auto">
                <div className="text-xs text-amber-400 mb-2">CLASSIFIED - EYES ONLY</div>
                <p className="leading-relaxed">
                  An enemy operative has infiltrated your location. One agent among you is the <span className="text-red-400 font-bold">SPY</span> - 
                  they must identify the location without being discovered. The remaining agents must expose the spy 
                  through careful questioning while avoiding giving away critical intelligence.
                </p>
                <div className="text-xs text-gray-500 mt-4 text-right">STATUS: ACTIVE • CLEARANCE LEVEL: RED</div>
              </div>
            </article>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-900/50 border border-red-900/50 p-6 shadow-lg">
                <div className="w-12 h-12 bg-red-800 border border-red-600 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-400 font-mono">PSYCHOLOGICAL OPS</h3>
                <p className="text-gray-400 text-sm">Deploy deception and counter-intelligence tactics</p>
              </div>
              <div className="bg-gray-900/50 border border-amber-900/50 p-6 shadow-lg">
                <div className="w-12 h-12 bg-amber-800 border border-amber-600 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-amber-400 font-mono">RAPID DEPLOYMENT</h3>
                <p className="text-gray-400 text-sm">Quick setup for immediate operational readiness</p>
              </div>
              <div className="bg-gray-900/50 border border-green-900/50 p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-800 border border-green-600 flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-400 font-mono">SECURE ACCESS</h3>
                <p className="text-gray-400 text-sm">Encrypted channels with no trace protocols</p>
              </div>
            </div>

            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800 border border-gray-600 hover:border-red-600 hover:bg-gray-700 transition-all duration-300 font-mono tracking-wide text-gray-300 hover:text-red-400 shadow-lg"
            >
              <Users className="w-5 h-5" />
              {showFAQ ? 'HIDE BRIEFING' : 'VIEW BRIEFING'}
            </button>
          </div>
        </section>

        {showFAQ && <FAQ />}
      </div>
    </main>
  );
}