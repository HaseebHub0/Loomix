import React, { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import type { SocialPost, Platform } from '../types';
import { PLATFORM_DIMENSIONS } from '../constants';

const LoadingState: React.FC = () => {
    const messages = ["Warming up the AI artists...", "Generating stunning visuals...", "Crafting the perfect caption...", "Finding the trendiest hashtags...", "Almost there, preparing the masterpiece!"];
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % messages.length;
            setMessage(messages[i]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (<div className="w-full aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 shadow-sm"><svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="text-lg font-semibold text-gray-800">{message}</p><p className="text-sm text-gray-500 mt-2">Please wait while the AI works its magic.</p></div>);
};

const InitialState: React.FC = () => (<div className="w-full aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M20.4 14.5c-2.4 2.4-6 2.4-8.4 0"></path><path d="m21 21-3.5-3.5"></path></svg><h3 className="text-xl font-bold text-gray-800">Your generated post will appear here</h3><p className="text-gray-500 mt-2">Fill out the form and click "Generate" to get started.</p></div>);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`${enabled ? 'bg-indigo-600' : 'bg-gray-400'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white`}
            role="switch"
            aria-checked={enabled}
        >
            <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
        </button>
    </div>
);

interface PreviewPanelProps {
  postData: SocialPost | null;
  isLoading: boolean;
  error: string | null;
  platform: Platform;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ postData, isLoading, error, platform }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showHeadline, setShowHeadline] = useState(true);
  
  const handleDownload = useCallback(() => {
    if (previewRef.current === null) return;
    toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `social-post-${platform}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Image download failed:', err));
  }, [platform]);

  return (
    <div className="space-y-6">
      
      <div className={`${PLATFORM_DIMENSIONS[platform].className} w-full max-w-2xl mx-auto transition-all duration-300`}>
        {isLoading && <LoadingState />}
        {!isLoading && !postData && <InitialState />}
        {!isLoading && postData && (
          <div 
            ref={previewRef} 
            className="w-full h-full relative overflow-hidden bg-gray-200 bg-cover bg-center rounded-xl shadow-lg transition-all duration-500"
            style={{ backgroundImage: `url(${postData.postImageUrl})` }}
          >
            {showHeadline && (
              <div className={`absolute top-0 left-0 w-full h-full p-8 flex ${postData.design.justifyContent} ${postData.design.alignItems} bg-gradient-to-t from-black/40 via-transparent to-black/20`}>
                  <h3 
                      className={`${postData.design.fontFamily} ${postData.design.textAlign} text-4xl lg:text-5xl font-extrabold leading-tight transition-all duration-300`}
                      style={{ color: postData.design.textColor, textShadow: '0 3px 10px rgba(0,0,0,0.7)' }}
                  >
                      {postData.headline}
                  </h3>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">{error}</div>}

      {postData && !isLoading && (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-md animate-[fade-in_0.5s_ease-in-out] max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Generated Caption & Hashtags</h3>
            <div className="flex items-center gap-4">
                <ToggleSwitch label="Show Headline" enabled={showHeadline} setEnabled={setShowHeadline} />
                <button onClick={handleDownload} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-500 transition-all duration-200 transform hover:scale-105 active:scale-100">
                  Download
                </button>
            </div>
          </div>
          <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 whitespace-pre-wrap font-light">{postData.caption}</p>
              <p className="text-indigo-600 font-medium">{postData.hashtags.join(' ')}</p>
          </div>
        </div>
      )}
    </div>
  );
};