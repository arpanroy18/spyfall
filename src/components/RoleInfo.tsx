import React, { useState } from 'react';
import { MapPin, Eye, EyeOff, Globe2 } from 'lucide-react';

interface RoleInfoProps {
  isSpy: boolean;
  location: string;
  country: string;
}

export function RoleInfo({ isSpy, location, country }: RoleInfoProps) {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 mb-8 cursor-pointer transition-all duration-200 hover:bg-gray-800/70"
      onClick={() => setIsHidden(!isHidden)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isHidden ? (
            <EyeOff className="w-6 h-6 text-gray-400" />
          ) : (
            isSpy ? (
              <EyeOff className="w-6 h-6 text-red-400" />
            ) : (
              <Eye className="w-6 h-6 text-green-400" />
            )
          )}
          <h2 className="text-xl font-semibold text-gray-200">
            Your Role: {isHidden ? (
              <span className="text-gray-400">???</span>
            ) : (
              <span className={isSpy ? "text-red-400" : "text-green-400"}>
                {isSpy ? 'Spy' : 'Civilian'}
              </span>
            )}
          </h2>
        </div>
        <div className="text-sm text-gray-400">Click to {isHidden ? 'show' : 'hide'}</div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Globe2 className="w-5 h-5 text-blue-400" />
          <span className="text-lg text-gray-300">
            Region: {isHidden ? (
              <span className="text-gray-400 font-medium">???</span>
            ) : (
              <span className="text-blue-400 font-medium">{country}</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-purple-400" />
          <span className="text-lg text-gray-300">
            Location: {isHidden ? (
              <span className="text-gray-400 font-medium">???</span>
            ) : (
              isSpy ? (
                <span className="text-red-400 font-medium">???</span>
              ) : (
                <span className="text-green-400 font-medium">{location}</span>
              )
            )}
          </span>
        </div>
      </div>
    </div>
  );
}