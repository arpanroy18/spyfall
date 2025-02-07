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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/20">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">End Game?</h2>
        </div>
        
        <p className="text-gray-300 mb-6">
          Are you sure you want to end the game? All players will return to the lobby.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium"
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}