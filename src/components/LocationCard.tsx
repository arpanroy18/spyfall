import React from 'react';
import { X, MapPin } from 'lucide-react';

interface LocationCardProps {
  location: string;
  isChecked: boolean;
  onClick: () => void;
}

export function LocationCard({ location, isChecked, onClick }: LocationCardProps) {
  return (
    <div 
      className={`relative cursor-pointer transition-all duration-300 border-2 bg-gray-900/80 backdrop-blur-sm hover:border-gray-500 hover:scale-105 rounded-lg overflow-hidden ${
        isChecked ? 'border-red-600 bg-red-900/20' : 'border-gray-700'
      }`}
      onClick={onClick}
    >
      {/* Checked off indicator */}
      {isChecked && (
        <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center z-10 backdrop-blur-sm">
          <X className="w-16 h-16 text-red-400 stroke-[3]" />
        </div>
      )}
      
      {/* Default placeholder image */}
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-b border-gray-700">
        <MapPin className="w-12 h-12 text-gray-500" />
      </div>
      
      {/* Location name */}
      <div className="p-3">
        <h3 className="text-sm font-mono text-gray-200 text-center tracking-wide">
          {location}
        </h3>
      </div>
    </div>
  );
}