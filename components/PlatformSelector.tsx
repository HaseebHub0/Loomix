
import React from 'react';
import type { Platform } from '../types';
import { PLATFORM_DIMENSIONS } from '../constants';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatform, onSelectPlatform }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
      {(Object.keys(PLATFORM_DIMENSIONS) as Platform[]).map((platform) => {
        const isActive = selectedPlatform === platform;
        return (
          <button
            key={platform}
            onClick={() => onSelectPlatform(platform)}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {PLATFORM_DIMENSIONS[platform].name}
          </button>
        );
      })}
    </div>
  );
};
