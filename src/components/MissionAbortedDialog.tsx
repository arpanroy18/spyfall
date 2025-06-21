import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MissionAbortedDialogProps {
  isOpen: boolean;
  onReturnHome: () => void;
}

export function MissionAbortedDialog({ isOpen, onReturnHome }: MissionAbortedDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 border-2 border-red-900/50 p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-900/20 relative">
        {/* Terminal header */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-red-900/50 flex items-center px-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="ml-4 text-xs text-gray-400 font-mono">MISSION_ABORT.exe</div>
        </div>
        
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-800/50 border border-red-600">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-red-400 font-mono tracking-wide">MISSION ABORTED</h2>
          </div>
          
          <div className="border-l-2 border-red-700 pl-4 bg-red-900/10 p-3 mb-6">
            <div className="text-xs text-red-400 font-mono mb-1">COMMANDER ALERT:</div>
            <p className="text-gray-300 text-sm font-mono">
              Mission has been terminated by command. All operatives will be returned to staging area.
            </p>
          </div>
          
          <button
            onClick={onReturnHome}
            className="w-full px-4 py-2 bg-red-800 hover:bg-red-700 border border-red-600 transition-colors text-white font-mono text-sm shadow-lg shadow-red-900/20"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    </div>
  );
}