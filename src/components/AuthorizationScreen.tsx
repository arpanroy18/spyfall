import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthorizationScreenProps {
  joiningCode: string;
  playerName: string;
  nameError: string;
  onPlayerNameChange: (value: string) => void;
  onJoin: () => void;
  onBack: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const AuthorizationScreen: React.FC<AuthorizationScreenProps> = ({
  joiningCode,
  playerName,
  nameError,
  onPlayerNameChange,
  onJoin,
  onBack,
  onKeyPress
}) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <header className="text-center mb-8 relative">
            <button
              onClick={onBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-400 transition-colors"
              aria-label="Back to main menu"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-bold mb-2 text-red-400 font-mono tracking-wider">INFILTRATE</h1>
            <div className="text-gray-400 font-mono">
              ACCESS CODE: <span className="font-mono text-xl text-amber-400 tracking-widest">{joiningCode}</span>
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
              <div className="ml-4 text-xs text-gray-400 font-mono">AGENT_AUTH.exe</div>
            </div>
            <div className="pt-4">
              <h2 className="text-lg font-semibold mb-4 text-red-400 font-mono tracking-wide">ENTER CODENAME</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => onPlayerNameChange(e.target.value)}
                  onKeyPress={onKeyPress}
                  placeholder="Agent codename"
                  className={`w-full px-4 py-3 bg-black/50 border text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-1 transition-all duration-300 
                    ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-amber-500 hover:border-gray-600'}`}
                />
                {nameError && (
                  <div className="text-red-400 text-sm font-mono">{nameError}</div>
                )}
                <button
                  onClick={onJoin}
                  disabled={!playerName.trim()}
                  className="w-full px-4 py-3 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
                >
                  AUTHORIZE ACCESS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 