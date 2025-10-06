export enum Sender {
    USER = 'user',
    AI = 'ai',
}

export interface VisualizationData {
    type: 'bar' | 'pie';
    title: string;
    data: { label: string; value: number }[];
}

export type MessageContent = 
    | { type: 'text'; value: string }
    | { type: 'visualization'; data: VisualizationData };

export interface Suggestion {
    title: string;
    prompt: string;
}

export interface ChatMessage {
    id: string;
    sender: Sender;
    content: MessageContent[];
    image?: string; // base64 image string for user messages
    suggestions?: Suggestion[];
}

export interface User {
    name: string;
    email: string;
}

export interface NPKValues {
    n: number;
    p: number;
    k: number;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy';
