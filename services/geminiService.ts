// FIX: This file was created to provide Gemini API integration for the application.
import { GoogleGenAI, Type } from '@google/genai';
import { ChatMessage, MessageContent, Sender, TopicSuggestion, VisualizationData } from '../types';

// FIX: Initialize GoogleGenAI client according to coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        response: {
            type: Type.ARRAY,
            description: "The main response content, which can be text or a data visualization.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        enum: ["text", "visualization"],
                        description: "The type of content part."
                    },
                    value: {
                        type: Type.STRING,
                        description: "The text content, if type is 'text'. Should be formatted in Markdown."
                    },
                    data: {
                        type: Type.OBJECT,
                        description: "The visualization data, if type is 'visualization'.",
                        properties: {
                            type: {
                                type: Type.STRING,
                                enum: ["bar", "pie"],
                                description: "The type of chart."
                            },
                            title: {
                                type: Type.STRING,
                                description: "The title of the chart."
                            },
                            data: {
                                type: Type.ARRAY,
                                description: "The data points for the chart.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        label: { type: Type.STRING },
                                        value: { type: Type.NUMBER }
                                    },
                                    required: ["label", "value"]
                                }
                            }
                        },
                         required: ["type", "title", "data"]
                    }
                },
                required: ["type"]
            }
        },
        suggestions: {
            type: Type.ARRAY,
            description: "A list of follow-up topic suggestions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    prompt: { type: Type.STRING }
                },
                required: ["title", "prompt"]
            }
        }
    },
    required: ["response"]
};

const batchTranslateSchema = {
    type: Type.OBJECT,
    properties: {
        translations: {
            type: Type.ARRAY,
            description: "An array of translated text strings, in the same order as the input.",
            items: {
                type: Type.STRING,
            }
        }
    },
    required: ["translations"]
};

export const getGeminiResponse = async (prompt: string, language: string, farmContext: string, image?: string): Promise<ChatMessage> => {
    
    const contentParts = [];
    if (image) {
        // FIX: Ensure image data is correctly formatted (base64 without data URI prefix).
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: image.split(',')[1],
            },
        };
        contentParts.push(imagePart);
    }
    // Combine the farm context with the user's prompt
    const fullPrompt = `${farmContext}\n\nUser's question: "${prompt}"`;
    contentParts.push({ text: fullPrompt });
    
    try {
        // FIX: Call Gemini API using the recommended `ai.models.generateContent` method.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: contentParts },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: { thinkingBudget: 0 },
                systemInstruction: `You are GreenGold, an AI assistant for agriculture. Your goal is to provide expert advice to farmers in a way that is very easy to understand.
- **VERY IMPORTANT**: You MUST use the "CURRENT FARM DATA" provided at the beginning of the user's prompt to formulate a specific, contextual, and actionable response. Do not give generic advice. Your advice must reflect the provided data points (weather, soil moisture, pH, NPK, etc.).
- **Be Concise**: Your answers MUST be short and to the point. Use bullet points.
- **Simplicity is Key**: Use simple, direct language. Avoid technical jargon.
- **Actionable Advice**: Offer clear, step-by-step solutions that a farmer can immediately act on.
- **Markdown Formatting**: Format all text responses using Markdown. Use bullet points (\`* \`) for lists and bold (\`**text**\`) for emphasis.
- **Data Visualization**: When data is requested (like 'show my crop distribution'), generate a 'bar' or 'pie' chart visualization.
- **Follow-up Suggestions**: Provide 2-3 relevant follow-up questions to guide the user.
- **Language**: Your entire response, including all text, MUST be in the user's specified language: ${language}.
- **Format**: The response must be a valid JSON object matching the provided schema. Do not wrap it in markdown backticks.`
            }
        });
        
        // FIX: Extract text and parse JSON response.
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        const content: MessageContent[] = [];

        if (parsedResponse.response && Array.isArray(parsedResponse.response)) {
             parsedResponse.response.forEach((item: any) => {
                if (item.type === 'text' && item.value) {
                    content.push({ type: 'text', value: item.value, originalValue: item.value });
                } else if (item.type === 'visualization' && item.data) {
                    content.push({ type: 'visualization', data: item.data as VisualizationData });
                }
            });
        }
        
        const suggestions: TopicSuggestion[] | undefined = parsedResponse.suggestions?.map((s: any) => ({
            title: s.title,
            originalTitle: s.title,
            prompt: s.prompt,
            originalPrompt: s.prompt,
        }));

        if (content.length === 0) {
            // Fallback for unexpected response format
             content.push({ type: 'text', value: "I couldn't process that request. Please try again.", originalValue: "I couldn't process that request. Please try again." });
        }

        return {
            id: Date.now().toString(),
            sender: Sender.AI,
            content,
            suggestions
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            id: Date.now().toString(),
            sender: Sender.AI,
            content: [{ type: 'text', value: 'Sorry, I encountered an error. Please try again later.', originalValue: 'Sorry, I encountered an error. Please try again later.' }]
        };
    }
};

export const translateTexts = async (texts: string[], targetLanguage: string): Promise<string[]> => {
    if (!texts || texts.length === 0) {
        return [];
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: `Translate each of the following strings into ${targetLanguage}. Maintain the original order and return ONLY the JSON object. Do not add any extra text or markdown formatting. Texts:\n${JSON.stringify(texts)}` }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: batchTranslateSchema
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (parsedResponse.translations && Array.isArray(parsedResponse.translations) && parsedResponse.translations.length === texts.length) {
            return parsedResponse.translations;
        } else {
            console.error("Translation response format is incorrect or length mismatch.");
            return texts; // Return original texts on format error
        }
    } catch (error) {
        console.error("Error translating texts:", error);
        return texts; // Return original texts on API error
    }
};