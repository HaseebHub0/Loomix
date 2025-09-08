export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'x';

export type LogoPosition = 'top-left' | 'top-right' | 'top-middle';

export interface UserInput {
  productDescription: string;
  style: string;
  platform: Platform;
  productImage?: File;
  logoImage?: File;
  logoPosition?: LogoPosition;
  brandColors?: { primary: string; secondary:string; };
  headlineText?: string;
  font?: string;
}

export interface DesignDetails {
  textColor: string;
  fontFamily: string;
  textAlign: 'text-left' | 'text-center' | 'text-right';
  justifyContent: 'justify-start' | 'justify-center' | 'justify-end';
  alignItems: 'items-start' | 'items-center' | 'items-end';
}

export interface SocialPost {
  postImageUrl: string;
  headline: string;
  caption: string;
  hashtags: string[];
  design: DesignDetails;
}

export interface User {
  uid: string; // Firebase User ID
  email: string | null;
  credits: number;
  plan: 'free' | 'pro';
}
