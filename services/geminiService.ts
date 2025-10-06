import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, MessageContent, Sender, Suggestion, VisualizationData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_API_KEY! });
const model = 'gemini-2.5-flash';

export const generateResponse = async (prompt: string, history: ChatMessage[], image?: string): Promise<ChatMessage> => {
    try {
        const systemInstruction = `You are GreenGold, an expert AI agronomist assistant for farmers in the Middle East.
        - Provide concise, actionable advice.
        - Use simple language.
        - If the user asks for a visualization (chart, graph), respond with a JSON object in this format: \`\`\`json\n{"visualization": {"type": "bar|pie", "title": "Chart Title", "data": [{"label": "string", "value": number}]}}\n\`\`\`
        - If you provide a text response, also provide up to 3 follow-up suggestions in this format: \`\`\`json\n{"suggestions": [{"title": "Suggestion Title", "prompt": "Follow-up Prompt"}]}\n\`\`\`
        - Combine text, visualizations, and suggestions in a single JSON response if needed. For example: \`\`\`json\n{"text": "...", "visualization": {...}, "suggestions": [...]}\n\`\`\`
        - Always respond in the language of the user's prompt.`;

        let contentParts: any[] = [{ text: prompt }];
        if (image) {
            const base64Data = image.split(',')[1];
            contentParts.unshift({
                inlineData: {
                    mimeType: image.split(';')[0].split(':')[1] || 'image/jpeg',
                    data: base64Data,
                }
            });
        }
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: contentParts }, // Assuming history is handled outside for now
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const text = response.text;

        let responseText = text;
        let visualization: VisualizationData | undefined = undefined;
        let suggestions: Suggestion[] | undefined = undefined;

        // Attempt to parse JSON from the response
        try {
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                const parsedJson = JSON.parse(jsonMatch[1]);
                responseText = parsedJson.text || text.replace(jsonMatch[0], '').trim();
                visualization = parsedJson.visualization;
                suggestions = parsedJson.suggestions;
            }
        } catch (e) {
            console.error("Could not parse JSON from Gemini response:", e);
            responseText = text; // Fallback to full text
        }
        
        const content: MessageContent[] = [];
        if (responseText) {
            content.push({ type: 'text', value: responseText });
        }
        if (visualization) {
            content.push({ type: 'visualization', data: visualization });
        }

        if (content.length === 0 && !suggestions) {
             content.push({ type: 'text', value: "I'm sorry, I couldn't generate a response. Please try again." });
        }

        return {
            id: Date.now().toString(),
            sender: Sender.AI,
            content: content,
            suggestions: suggestions,
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            id: Date.now().toString(),
            sender: Sender.AI,
            content: [{ type: 'text', value: "Sorry, I'm having trouble connecting. Please check your connection and API key." }],
        };
    }
};
