import type { UserInput, SocialPost } from '../types';
import { generateSocialPost as generateWithGemini } from './geminiService';
import { generateSocialPost as generateWithStability } from './stabilityService';

export type AIProvider = 'gemini' | 'stability';

export interface AIServiceConfig {
  provider: AIProvider;
  geminiApiKey?: string;
  stabilityApiKey?: string;
}

class AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateSocialPost(input: UserInput): Promise<SocialPost> {
    console.log(`Generating social post using ${this.config.provider}...`);
    
    try {
      switch (this.config.provider) {
        case 'gemini':
          return await generateWithGemini(input);
        case 'stability':
          return await generateWithStability(input);
        default:
          throw new Error(`Unsupported AI provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error(`Error with ${this.config.provider}:`, error);
      
      // Fallback to Gemini if Stability AI fails
      if (this.config.provider === 'stability') {
        console.log('Falling back to Gemini...');
        try {
          return await generateWithGemini(input);
        } catch (fallbackError) {
          console.error('Fallback to Gemini also failed:', fallbackError);
          throw new Error(`Both AI providers failed. Original error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      throw error;
    }
  }

  setProvider(provider: AIProvider) {
    this.config.provider = provider;
    console.log(`AI provider switched to: ${provider}`);
  }

  getCurrentProvider(): AIProvider {
    return this.config.provider;
  }

  async testConnection(): Promise<{ provider: AIProvider; status: boolean; message: string }> {
    switch (this.config.provider) {
      case 'gemini':
        try {
          // Simple test - try to generate a minimal image
          const testInput: UserInput = {
            productDescription: 'test',
            style: 'Minimalist & Clean',
            platform: 'instagram'
          };
          await generateWithGemini(testInput);
          return { provider: 'gemini', status: true, message: 'Gemini API is working' };
        } catch (error) {
          return { 
            provider: 'gemini', 
            status: false, 
            message: `Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}` 
          };
        }
      
      case 'stability':
        try {
          const { testStabilityConnection } = await import('./stabilityService');
          const isConnected = await testStabilityConnection();
          return { 
            provider: 'stability', 
            status: isConnected, 
            message: isConnected ? 'Stability AI API is working' : 'Stability AI API connection failed' 
          };
        } catch (error) {
          return { 
            provider: 'stability', 
            status: false, 
            message: `Stability AI API error: ${error instanceof Error ? error.message : 'Unknown error'}` 
          };
        }
      
      default:
        return { 
          provider: this.config.provider, 
          status: false, 
          message: `Unknown provider: ${this.config.provider}` 
        };
    }
  }
}

// Create default instance
const defaultConfig: AIServiceConfig = {
  provider: 'gemini', // Default to Gemini
  geminiApiKey: "AIzaSyBxv9qWa6GHM5WX5nGJZkq7T1ggH1giNuc", // Your existing Gemini key
  stabilityApiKey: "YOUR_STABILITY_API_KEY_HERE" // Replace with your Stability AI key
};

export const aiService = new AIService(defaultConfig);

// Export the class for custom instances
export { AIService };
