import type { Platform } from './types';

export const PLATFORM_DIMENSIONS: Record<Platform, { name:string; aspectRatio: string; apiAspectRatio: '1:1' | '16:9'; className: string }> = {
  instagram: { name: 'Instagram', aspectRatio: '1 / 1', apiAspectRatio: '1:1', className: 'aspect-square' },
  facebook: { name: 'Facebook', aspectRatio: '1.91 / 1', apiAspectRatio: '1:1', className: 'aspect-[1.91/1]' },
  linkedin: { name: 'LinkedIn', aspectRatio: '1.91 / 1', apiAspectRatio: '1:1', className: 'aspect-[1.91/1]' },
  x: { name: 'X (Twitter)', aspectRatio: '16 / 9', apiAspectRatio: '16:9', className: 'aspect-video' },
};

export const STYLES = [
  { id: 'photorealistic', name: 'Photorealistic' },
  { id: 'cinematic', name: 'Cinematic' },
  { id: 'colorful', name: 'Colorful & Vibrant' },
  { id: 'bw', name: 'Black & White' },
  { id: '90s', name: '90s Retro' },
  { id: 'minimalist', name: 'Minimalist & Clean' },
  { id: 'luxury', name: 'Luxury & Elegant' },
];

export const FONTS = [
    { id: 'font-sans', name: 'Modern Sans-Serif' },
    { id: 'font-serif', name: 'Classic Serif' },
    { id: 'font-mono', name: 'Techy Mono' },
];