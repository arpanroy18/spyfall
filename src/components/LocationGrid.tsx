import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { LOCATIONS } from '../types';
import { LocationCard } from './LocationCard';

export function LocationGrid() {
  const [checkedLocations, setCheckedLocations] = useState<Set<string>>(new Set());

  const toggleLocation = (location: string) => {
    setCheckedLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(location)) {
        newSet.delete(location);
      } else {
        newSet.add(location);
      }
      return newSet;
    });
  };

  return (
    <div className="mt-8 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Map className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-gray-200 font-mono tracking-wide">
          POSSIBLE LOCATIONS
        </h2>
        <div className="text-xs text-gray-500 font-mono">
          ({checkedLocations.size}/{LOCATIONS.length} ELIMINATED)
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {LOCATIONS.map((locationData) => (
          <LocationCard
            key={locationData.location}
            location={locationData.location}
            isChecked={checkedLocations.has(locationData.location)}
            onClick={() => toggleLocation(locationData.location)}
          />
        ))}
      </div>
      
      {checkedLocations.size > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setCheckedLocations(new Set())}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 text-sm font-mono transition-colors duration-200"
          >
            CLEAR ALL
          </button>
        </div>
      )}
    </div>
  );
}