import React, { useState, useEffect } from 'react';
import type { UserInput, LogoPosition, Platform, AIProvider } from '../types';
import { STYLES, FONTS } from '../constants';
import { PlatformSelector } from './PlatformSelector';
import AIProviderSelector from './AIProviderSelector';
import { useAuth } from '../hooks/useAuth';

const ImageUploader: React.FC<{
    label: string;
    onFileChange: (file: File | null) => void;
}> = ({ label, onFileChange }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleFileSelect = (file: File | null) => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        
        if (file && file.type.startsWith('image/')) {
            setImagePreview(URL.createObjectURL(file));
            onFileChange(file);
        } else {
            setImagePreview(null);
            onFileChange(null);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.preventDefault();
        handleFileSelect(null);
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragState: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragState);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e, false);
        handleFileSelect(e.dataTransfer.files?.[0] || null);
    };

    return (
        <div>
            {imagePreview ? (
                <div className="relative group transition-all duration-300">
                    <img src={imagePreview} alt={`${label} preview`} className="rounded-lg w-full h-auto object-cover shadow-lg" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-300">
                        <button onClick={handleRemoveImage} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">Remove</button>
                    </div>
                </div>
            ) : (
                <div
                    onDragEnter={e => handleDragEvents(e, true)}
                    onDragLeave={e => handleDragEvents(e, false)}
                    onDragOver={e => handleDragEvents(e, true)}
                    onDrop={handleDrop}
                    className={`mt-1 flex justify-center px-6 py-4 border-2 border-dashed rounded-md transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 hover:border-gray-600'}`}
                >
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-10 w-10 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <div className="flex text-sm text-gray-400"><label htmlFor={label} className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 px-1"><span>Upload {label}</span><input id={label} name={label} type="file" className="sr-only" onChange={e => handleFileSelect(e.target.files?.[0] || null)} accept="image/png, image/jpeg" /></label><p className="pl-1">or drag & drop</p></div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const InputForm: React.FC<{ onSubmit: (data: UserInput) => void; isLoading: boolean; }> = ({ onSubmit, isLoading }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UserInput>({ 
    productDescription: '', 
    style: STYLES[0].id,
    platform: 'instagram',
    aiProvider: 'gemini' // Default to Gemini
  });
  
  const hasCredits = user ? user.credits > 0 : false;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCredits) return;
    onSubmit(formData);
  };
  
  const setFormValue = <K extends keyof UserInput>(key: K, value: UserInput[K]) => {
      setFormData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (formData.logoImage && !formData.logoPosition) {
        setFormValue('logoPosition', 'top-right');
    }
    if (!formData.logoImage && formData.logoPosition) {
        setFormValue('logoPosition', undefined);
    }
  }, [formData.logoImage, formData.logoPosition]);


  const handleBrandColorsChange = (colorType: 'primary' | 'secondary', value: string) => {
      setFormData(prev => ({
          ...prev,
          brandColors: {
              ...prev.brandColors,
              primary: colorType === 'primary' ? value : prev.brandColors?.primary || '#FFFFFF',
              secondary: colorType === 'secondary' ? value : prev.brandColors?.secondary || '#000000',
          }
      }))
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-4">
            <h2 className="text-base font-semibold text-indigo-400">Step 1: Product & Description</h2>
            <div>
                 <label htmlFor="productDescription" className="block text-sm font-medium text-gray-400 mb-1">Product Description*</label>
                <textarea
                    id="productDescription"
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-gray-500"
                    value={formData.productDescription}
                    onChange={e => setFormValue('productDescription', e.target.value)}
                    required
                    placeholder="e.g., A stylish, eco-friendly water bottle..."
                />
            </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-base font-semibold text-indigo-400">Step 2: AI Provider</h2>
            <AIProviderSelector
                selectedProvider={formData.aiProvider || 'gemini'}
                onProviderChange={(provider) => setFormValue('aiProvider', provider)}
                disabled={isLoading}
            />
        </div>

        <div className="space-y-4">
            <h2 className="text-base font-semibold text-indigo-400">Step 3: Platform & Style</h2>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Platform*</label>
                <PlatformSelector selectedPlatform={formData.platform} onSelectPlatform={(p) => setFormValue('platform', p)} />
            </div>
            <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-400 mb-1">Art Style*</label>
                <select id="style" value={formData.style} onChange={(e) => setFormValue('style', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 transition">
                    {STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
        </div>


        <div className="space-y-4">
             <h2 className="text-base font-semibold text-indigo-400">Step 4: Brand Assets (Optional)</h2>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                <ImageUploader label="Product" onFileChange={file => setFormValue('productImage', file || undefined)} />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Logo</label>
                <ImageUploader label="Logo" onFileChange={file => setFormValue('logoImage', file || undefined)} />
             </div>
             {formData.logoImage && (
                <div className="pt-2 animate-[fade-in_0.3s_ease-in-out]">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Logo Position</label>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-700/50 p-1">
                        {(['top-left', 'top-middle', 'top-right'] as LogoPosition[]).map((pos) => {
                            const isActive = formData.logoPosition === pos;
                            const label = pos.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return (
                                <button
                                    key={pos}
                                    type="button"
                                    onClick={() => setFormValue('logoPosition', pos)}
                                    className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'bg-transparent text-gray-300 hover:bg-gray-800'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
             )}
        </div>

        <div className="space-y-4">
            <h2 className="text-base font-semibold text-indigo-400">Step 5: Fine-Tuning (Optional)</h2>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Brand Colors</label>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label htmlFor="primaryColor" className="text-xs text-gray-500">Primary</label>
                        <input id="primaryColor" type="color" value={formData.brandColors?.primary || '#FFFFFF'} onChange={e => handleBrandColorsChange('primary', e.target.value)} className="w-full h-10 p-1 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer" />
                    </div>
                     <div className="w-1/2">
                        <label htmlFor="secondaryColor" className="text-xs text-gray-500">Secondary</label>
                        <input id="secondaryColor" type="color" value={formData.brandColors?.secondary || '#000000'} onChange={e => handleBrandColorsChange('secondary', e.target.value)} className="w-full h-10 p-1 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer" />
                    </div>
                </div>
            </div>
            <div>
                 <label htmlFor="headlineText" className="block text-sm font-medium text-gray-400 mb-1">Custom Headline</label>
                <input
                    id="headlineText"
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-gray-500"
                    value={formData.headlineText || ''}
                    onChange={e => setFormValue('headlineText', e.target.value)}
                    placeholder="Leave blank for AI to generate"
                />
            </div>
            <div>
                <label htmlFor="font" className="block text-sm font-medium text-gray-400 mb-1">Font Preference</label>
                <select id="font" value={formData.font || ''} onChange={(e) => setFormValue('font', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 transition">
                    <option value="">Default</option>
                    {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
            </div>
        </div>

        <div>
            <button type="submit" disabled={isLoading || !formData.productDescription || !hasCredits} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100">
            {isLoading ? (
                <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>
            ) : hasCredits ? 'Generate with this model ✨' : 'No Credits Remaining'}
            </button>
            {!hasCredits && (
                <p className="text-center text-xs text-red-400 mt-2">
                    You've used all your credits. <a href="#/settings" className="underline hover:text-red-300">Upgrade to Pro</a> for more.
                </p>
            )}
        </div>
      </form>
  );
};