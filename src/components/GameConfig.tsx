import React from 'react';
import { Settings, Clock, Users } from 'lucide-react';
import { GameConfig } from '../types';

interface GameConfigPanelProps {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
}

export function GameConfigPanel({ config, onConfigChange }: GameConfigPanelProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-gray-200">Game Settings</h2>
      </div>

      <div className="grid gap-6">
        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <Users className="w-4 h-4" />
            Number of Spies
          </label>
          <select
            value={config.numSpies}
            onChange={(e) => onConfigChange({ ...config, numSpies: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={1}>1 Spy</option>
            <option value={2}>2 Spies</option>
            <option value={3}>3 Spies</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <Clock className="w-4 h-4" />
            Time Limit (minutes)
          </label>
          <select
            value={config.timeLimit / 60}
            onChange={(e) => onConfigChange({ ...config, timeLimit: Number(e.target.value) * 60 })}
            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={6}>6 Minutes</option>
            <option value={8}>8 Minutes</option>
            <option value={10}>10 Minutes</option>
          </select>
        </div>
      </div>
    </div>
  );
}