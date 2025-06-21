import React from 'react';
import { XCircle } from 'lucide-react';

interface EndGameDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EndGameDialog({ isOpen, onConfirm, onCancel }: EndGameDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 border-2 border-red-900/50 p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-900/20 relative">
        {/* Terminal header */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-red-900/50 flex items-center px-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="ml-4 text-xs text-gray-400 font-mono">ABORT_CONFIRM.exe</div>
        </div>
        
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-800/50 border border-red-600">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-red-400 font-mono tracking-wide">ABORT MISSION?</h2>
          </div>
          
          <div className="border-l-2 border-amber-700 pl-4 bg-amber-900/10 p-3 mb-6">
            <div className="text-xs text-amber-400 font-mono mb-1">WARNING:</div>
            <p className="text-gray-300 text-sm font-mono">
              Mission termination will disconnect all operatives and return to staging area.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors text-gray-200 font-mono text-sm"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-800 hover:bg-red-700 border border-red-600 transition-colors text-white font-mono text-sm shadow-lg shadow-red-900/20"
            >
              ABORT MISSION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}