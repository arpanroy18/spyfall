import React, { useState } from 'react';
import { MapPin, Eye, EyeOff, User } from 'lucide-react';

interface RoleInfoProps {
  isSpy: boolean;
  location: string;
  role: string;
}

export function RoleInfo({ isSpy, location, role }: RoleInfoProps) {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div 
      className="bg-gray-900/90 backdrop-blur-sm border-2 border-red-900/50 p-6 shadow-2xl shadow-red-900/20 mb-8 cursor-pointer transition-all duration-300 hover:border-red-700/70 relative"
      onClick={() => setIsHidden(!isHidden)}
    >
      {/* Terminal header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-red-900/50 flex items-center px-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400 font-mono">AGENT_PROFILE.exe</div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isHidden ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              isSpy ? (
                <EyeOff className="w-5 h-5 text-red-400" />
              ) : (
                <Eye className="w-5 h-5 text-green-400" />
              )
            )}
            <h2 className="text-lg font-semibold text-gray-200 font-mono tracking-wide">
              INTEL BRIEFING
            </h2>
          </div>
          <div className="text-xs text-gray-500 font-mono">CLICK TO {isHidden ? 'REVEAL' : 'CONCEAL'}</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 border-l-2 border-blue-700 pl-3 bg-blue-900/10">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300 font-mono">
              ROLE: {isHidden ? (
                <span className="text-gray-400 font-medium">CLASSIFIED</span>
              ) : (
                isSpy ? (
                  <span className="text-red-400 font-medium">SPY</span>
                ) : (
                  <span className="text-blue-400 font-medium">{role}</span>
                )
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-amber-700 pl-3 bg-amber-900/10">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-300 font-mono">
              LOCATION: {isHidden ? (
                <span className="text-gray-400 font-medium">CLASSIFIED</span>
              ) : (
                isSpy ? (
                  <span className="text-red-400 font-medium">UNKNOWN</span>
                ) : (
                  <span className="text-green-400 font-medium">{location}</span>
                )
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}