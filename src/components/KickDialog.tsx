import React from 'react';
import { UserX } from 'lucide-react';

interface KickDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KickDialog({ isOpen, onClose }: KickDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/20">
            <UserX className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200">Removed from Game</h2>
        </div>
        
        <p className="text-gray-300 mb-6">
          Sorry, the leader has removed you from the game.
        </p>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg text-gray-200"
        >
          OK
        </button>
      </div>
    </div>
  );
}