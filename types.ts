// FIX: This file was created to provide type definitions for the application.
export enum Sender {
    USER = 'user',
    AI = 'ai',
}

export interface VisualizationData {
    type: 'bar' | 'pie';
    title: string;
    data: { label: string; value: number }[];
}

export type MessageContentType = 'text' | 'visualization';

export interface MessageContent {
    type: MessageContentType;
    value?: string;
    originalValue?: string;
    data?: VisualizationData;
}

export interface TopicSuggestion {
    title: string;
    originalTitle: string;
    prompt: string;
    originalPrompt: string;
}

export interface ChatMessage {
    id: string;
    sender: Sender;
    content: MessageContent[];
    suggestions?: TopicSuggestion[];
    image?: string;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy';

export interface NPKValues {
    n: number;
    p: number;
    k: number;
}

export interface FarmDetails {
    farmName: string;
    farmSize: number;
    primaryCrops: string;
}

export interface User extends FarmDetails {
    email: string;
    password?: string; // Optional for security reasons when handling user objects
}