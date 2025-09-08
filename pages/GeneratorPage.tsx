import React, { useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { PreviewPanel } from '../components/PreviewPanel';
import type { SocialPost, UserInput, Platform } from '../types';
import { aiService } from '../services/aiService';
import { useAuth } from '../hooks/useAuth';

function GeneratorPage() {
  const { decrementCredits } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [postData, setPostData] = useState<SocialPost | null>(null);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>('instagram');

  const handleGenerate = useCallback(async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    setPostData(null);
    setPreviewPlatform(input.platform); 

    try {
      // Set the AI provider based on user selection
      if (input.aiProvider) {
        aiService.setProvider(input.aiProvider);
      }
      
      const result = await aiService.generateSocialPost(input);
      setPostData(result);
      decrementCredits(); // Decrement credit on successful generation
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [decrementCredits]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar onSubmit={handleGenerate} isLoading={isLoading} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-4 md:p-8">
            <PreviewPanel
              postData={postData}
              isLoading={isLoading}
              error={error}
              platform={previewPlatform}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default GeneratorPage;
