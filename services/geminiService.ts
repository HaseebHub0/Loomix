
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { UserInput, SocialPost, DesignDetails } from '../types';
import { PLATFORM_DIMENSIONS } from '../constants';

// The API_KEY is now expected to be set in the environment and will be used by the GoogleGenAI constructor.
// Removing the immediate throw makes the app more resilient if the key is not available during initial load.
const ai = new GoogleGenAI({ apiKey: "AIzaSyBxv9qWa6GHM5WX5nGJZkq7T1ggH1giNuc" });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};

const generatePostImage = async (input: UserInput): Promise<string> => {
    const { productDescription, style, brandColors, font, productImage, logoImage, logoPosition, platform } = input;
    const { aspectRatio, apiAspectRatio, name } = PLATFORM_DIMENSIONS[platform];
    const aspectRatioName = name.split(' ')[0]; // e.g., 'Instagram', 'Facebook'

    let imageGenerationPrompt = `
      **ROLE:** You are a world-class Art Director and professional graphic designer, creating a social media post for a major brand.
      **TASK:** Generate a single, final, polished social media post image. The result must be indistinguishable from a high-end professional photograph or graphic design piece.
      **ABSOLUTE RULE:** DO NOT add any text overlays to the image. Text will be added later. The image must be purely visual.
    `;

    const parts: any[] = [];
    let imageInstructions = ''; // We will build image-specific instructions here.

    if (productImage) {
        const productImagePart = await fileToGenerativePart(productImage);
        parts.push(productImagePart);
        imageInstructions += `
      - **Provided Product Image:** The first image provided is the product. Your main task is to build a completely new, stunning environment around this product based on the creative brief.
        - **Integration:** Place the original, UNMODIFIED product image into the new scene.
        - **Lighting & Shadows:** The lighting in the new environment MUST perfectly match the lighting on the product. Cast realistic, soft shadows from the product onto the background.
        - **Perspective:** Ensure a perfect perspective match. The final result should look like it was photographed in-camera, not composited.
    `;
    } else {
        imageInstructions += `- **Product Generation:** No product image was provided. You must generate the product from scratch based on the description, and place it within the scene you create.`;
    }

    if (logoImage) {
        const logoImagePart = await fileToGenerativePart(logoImage);
        parts.push(logoImagePart);
        const position = logoPosition || 'top-right';
        const positionDescription = {
            'top-left': 'top-left corner',
            'top-right': 'top-right corner',
            'top-middle': 'top center of the image'
        }[position];
        
        // Explicitly tell the model which image is the logo based on its order.
        const logoImageReference = productImage ? 'The second image provided is the brand logo.' : 'The first image provided is the brand logo.';

        imageInstructions += `
      - **Provided Logo:** ${logoImageReference}
        - **Logo Placement:** You MUST place this logo in the ${positionDescription}.
        - **Logo Integration:** The logo should be integrated gracefully and subtly. It must be perfectly legible but not visually distracting from the main subject. Ensure its color, lighting, and texture blend naturally with the overall scene. It could be a tasteful watermark or appear on a clear surface in the background. Do not place it over critical parts of the main product or subject.
    `;
    }

    // Construct the final prompt with all instructions.
    imageGenerationPrompt += `
      **CREATIVE BRIEF:**
      - **Product Description:** "${productDescription}"
      - **Target Platform & Aspect Ratio:** ${aspectRatioName}. The final image's composition MUST be optimized for a ${aspectRatio} aspect ratio.
      - **Art Style:** "${style}". This is the most important instruction. The entire aesthetic, including lighting, composition, mood, and color grading, must reflect this style.
        - *For 'Photorealistic' or 'Cinematic':* Emphasize dramatic, professional lighting, shallow depth of field, and a composition that feels intentional and high-budget.
        - *For '90s Retro':* Use film grain, slightly faded colors, and era-appropriate props and environments.
        - *For 'Minimalist & Clean':* Use negative space, simple backgrounds, and a focus on product form and texture.
        - *For 'Luxury & Elegant':* Use sophisticated materials (marble, silk), soft lighting, and a refined, uncluttered composition.
      - **Brand Colors (Inspiration):** ${brandColors ? `Primary: ${brandColors.primary}, Secondary: ${brandColors.secondary}` : 'Not specified'}. These colors should subtly influence the environment's color palette, props, or lighting. Do not simply make the background this color; integrate it naturally.
      - **Font Preference (Mood):** ${font || 'Not specified'}. This hints at the overall design mood (e.g., 'Modern Sans-Serif' suggests a clean, contemporary scene).

      **EXECUTION DETAILS:**
      - **Composition:** Apply professional design principles (e.g., rule of thirds, leading lines, visual balance), keeping the ${aspectRatio} aspect ratio in mind. The product is the hero.
      - **Quality:** Must be hyper-realistic, 8K, and ultra-detailed. No "AI-generated" look, no plastic textures, no distorted elements.
      ${imageInstructions}
    `;

    parts.push({ text: imageGenerationPrompt });

    if (!productImage && !logoImage) { // Text-only image generation
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imageGenerationPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: apiAspectRatio,
            },
        });
        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("Failed to generate product image.");
        }
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;

    } else { // Multi-modal image generation/editing
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (imagePart && imagePart.inlineData) {
            const base64ImageBytes: string = imagePart.inlineData.data;
            return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
        throw new Error("The model did not return an image. The combination of inputs might be too complex.");
    }
};


const generateTextAndDesign = async (input: UserInput): Promise<{ headline: string; caption: string; hashtags: string[]; design: DesignDetails }> => {
  const { productDescription, style, brandColors, font, headlineText } = input;
  const prompt = `
    You are a world-class social media marketing expert and copywriter for a major brand.
    Based on the creative brief below, generate content for a premium social media post.

    **Creative Brief:**
    - **Product Description:** "${productDescription}"
    - **Art Style / Mood:** "${style}"
    - **Brand Colors:** ${brandColors ? `Primary: ${brandColors.primary}, Secondary: ${brandColors.secondary}` : 'Not specified'}
    - **Font Preference:** ${font || 'Not specified'}
    - **User-Provided Headline:** ${headlineText || 'Not provided. Please generate one.'}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: {
            type: Type.STRING,
            description: headlineText 
              ? `Use the exact user-provided headline: "${headlineText}"`
              : "A short, powerful, and viral-worthy headline (3-7 words) that matches the specified style and product. Make it catchy and memorable."
          },
          caption: {
            type: Type.STRING,
            description: "An engaging and sophisticated caption (2-3 sentences) that matches the Art Style / Mood. It should tell a story or evoke an emotion."
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A curated list of 5-7 relevant and trending hashtags that align with the style and product."
          },
          design: {
            type: Type.OBJECT,
            properties: {
              textColor: {
                type: Type.STRING,
                description: `A hex color code for the text overlay. It must provide excellent contrast against a complex photograph. Prioritize #FFFFFF or an off-white, unless the brand colors strongly suggest a readable alternative (e.g., a dark color for a very light background). Selected Primary Brand Color is ${brandColors?.primary || 'N/A'}.`
              },
              fontFamily: {
                type: Type.STRING,
                description: `Suggest a font family that matches the brand's feel. Use the user's preference '${font || 'font-sans'}' as a primary guide. Output a Tailwind CSS class: 'font-sans', 'font-serif', or 'font-mono'.`
              },
              textAlign: {
                type: Type.STRING,
                description: "Text alignment Tailwind class for the headline: 'text-left', 'text-center', or 'text-right'. Choose what is best for a professional design."
              },
              justifyContent: {
                  type: Type.STRING,
                  description: "Flexbox justify content Tailwind class for the text container: 'justify-start', 'justify-center', or 'justify-end'."
              },
              alignItems: {
                  type: Type.STRING,
                  description: "Flexbox align items Tailwind class for the text container: 'items-start', 'items-center', or 'items-end'."
              }
            }
          }
        },
      },
    },
  });

  const jsonText = response.text.trim();
  try {
    const parsed = JSON.parse(jsonText);
    if (headlineText) { // Ensure user's headline is used if provided
        parsed.headline = headlineText;
    }
    if (!parsed.headline || !parsed.caption || !parsed.hashtags || !parsed.design) {
        throw new Error("AI response is missing required fields.");
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", jsonText, e);
    throw new Error("Could not parse AI response. Please try again.");
  }
};

export const generateSocialPost = async (input: UserInput): Promise<SocialPost> => {
    try {
        const postImagePromise = generatePostImage(input);
        const textAndDesignPromise = generateTextAndDesign(input);

        const [postImageUrl, { headline, caption, hashtags, design }] = await Promise.all([
            postImagePromise,
            textAndDesignPromise,
        ]);

        return {
            postImageUrl,
            headline,
            caption,
            hashtags,
            design,
        };
    } catch (error) {
        console.error("Error in generateSocialPost:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate social post: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the social post.");
    }
};