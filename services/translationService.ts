
import { GoogleGenAI } from '@google/genai';

// The API key is expected to be available in the environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This is a fallback for development; in a production environment, the key should be set.
    console.warn("API_KEY environment variable not set. The application may not function correctly.");
}


export const translateText = async (text: string): Promise<string> => {
    // Re-initialize the client on each call to ensure the latest API key is used,
    // especially in environments where it might be updated dynamically.
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // Specific prompt to ensure only the translation is returned.
            contents: `Translate the following English text to Kannada. Provide ONLY the translated text, without any additional explanations, formatting, or introductory phrases. English text: "${text}"`,
            config: {
                temperature: 0.3, // Lower temperature for more deterministic translation
            }
        });
        
        // The .text property is the most direct way to get the output.
        return response.text.trim();

    } catch (error) {
        console.error("Error during translation API call:", error);
        // Propagate a more user-friendly error message.
        throw new Error("Could not connect to the translation service.");
    }
};
