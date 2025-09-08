import React from 'react';
import type { AIProvider } from '../types';

interface AIProviderSelectorProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  disabled?: boolean;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  disabled = false
}) => {
  const providers = [
    {
      id: 'gemini' as AIProvider,
      name: 'Google Gemini',
      description: 'Advanced multimodal AI with image generation and editing',
      features: ['Image generation', 'Text generation', 'Image editing', 'Multimodal'],
      icon: '🤖'
    },
    {
      id: 'stability' as AIProvider,
      name: 'Stability AI',
      description: 'High-quality image generation with Stable Diffusion',
      features: ['High-quality images', 'Fast generation', 'Multiple styles', 'Professional'],
      icon: '🎨'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Provider
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Choose which AI service to use for generating your social media posts
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`
              relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selectedProvider === provider.id
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !disabled && onProviderChange(provider.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{provider.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {provider.name}
                  </h3>
                  {selectedProvider === provider.id && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {provider.description}
                </p>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {selectedProvider === provider.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedProvider === 'stability' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Stability AI Setup Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  To use Stability AI, you need to:
                </p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Get an API key from <a href="https://platform.stability.ai/" target="_blank" rel="noopener noreferrer" className="underline">Stability AI Platform</a></li>
                  <li>Update the API key in <code className="bg-yellow-100 px-1 rounded">services/stabilityService.ts</code></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProviderSelector;
