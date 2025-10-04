

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, NPKValues, Sender, TopicSuggestion, WeatherCondition, MessageContent } from './types';
import { getGeminiResponse, translateTexts } from './services/geminiService';
import { getRuleBasedResponse } from './services/ruleBasedService';
import { useLocalization } from './hooks/useLocalization';

import LanguageSelector from './components/LanguageSelector';
// FIX: The root Dashboard.tsx component is now used, as it's the one with the reported error.
import Dashboard from './components/Dashboard';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Spinner from './components/Spinner';
import CameraCapture from './components/CameraCapture';
import InitialActions from './components/InitialActions';
import TTSButton from './components/TTSButton';
import LanguageSwitcher from './components/LanguageSwitcher';
import { marked } from 'marked';

import { LogoIcon, UserIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon } from './components/Icons';

const App: React.FC = () => {
    // State variables
    const { t, language, setLanguage } = useLocalization();
    const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showDashboard, setShowDashboard] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Dashboard state
    const [moisture, setMoisture] = useState(75);
    const [isIrrigating, setIsIrrigating] = useState(false);
    const [isDraining, setIsDraining] = useState(false);
    const [weather, setWeather] = useState<WeatherCondition>('sunny');
    const [phValue, setPhValue] = useState(6.2);
    const [npkValues, setNpkValues] = useState<NPKValues>({ n: 13, p: 7, k: 12 });

    // Image capture state
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = useCallback(async (prompt: string, image?: string) => {
        if (!prompt && !image) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: Sender.USER,
            content: [{ type: 'text', value: prompt, originalValue: prompt }],
            image: image,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setCapturedImage(null);
        setIsLoading(true);
        setShowDashboard(false);

        // First, check rule-based service for a direct match
        const ruleResponse = getRuleBasedResponse(prompt, language);
        if (ruleResponse) {
             const enrichedResponse: ChatMessage = {
                ...ruleResponse,
                content: ruleResponse.content.map(c => ({ ...c, originalValue: c.value }))
            };
            setTimeout(() => {
                setMessages(prev => [...prev, enrichedResponse]);
                setIsLoading(false);
            }, 500); // 0.5s delay for a more natural feel
            return;
        }

        // If no match, call Gemini
        try {
            const aiResponse = await getGeminiResponse(prompt, language, image);
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                sender: Sender.AI,
                content: [{ type: 'text', value: t('genericError'), originalValue: t('genericError') }]
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [language, t]);

    const handleLanguageChange = async (langCode: string) => {
        if (langCode === language) return;
        setLanguage(langCode);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (messages.length === 0) return;

        const translateConversation = async () => {
            setIsTranslating(true);
            
            const textsToTranslate: string[] = [];
            const translationMap: { msgIndex: number, type: 'content' | 'suggestion', contentIndex: number, field: 'value' | 'title' | 'prompt' }[] = [];

            messages.forEach((msg, msgIndex) => {
                msg.content.forEach((content, contentIndex) => {
                    if (content.type === 'text' && content.originalValue) {
                        textsToTranslate.push(content.originalValue);
                        translationMap.push({ msgIndex, type: 'content', contentIndex, field: 'value' });
                    }
                });
                msg.suggestions?.forEach((suggestion, suggestionIndex) => {
                    textsToTranslate.push(suggestion.originalTitle);
                    translationMap.push({ msgIndex, type: 'suggestion', contentIndex: suggestionIndex, field: 'title' });
                    textsToTranslate.push(suggestion.originalPrompt);
                    translationMap.push({ msgIndex, type: 'suggestion', contentIndex: suggestionIndex, field: 'prompt' });
                });
            });

            const translatedTexts = await translateTexts(textsToTranslate, language);
            
            const newMessages = JSON.parse(JSON.stringify(messages)); // Deep copy

            let textIndex = 0;
            translationMap.forEach(mapInfo => {
                const { msgIndex, type, contentIndex, field } = mapInfo;
                if (type === 'content') {
                    newMessages[msgIndex].content[contentIndex].value = translatedTexts[textIndex];
                } else if (type === 'suggestion') {
                    if(field === 'title') newMessages[msgIndex].suggestions[contentIndex].title = translatedTexts[textIndex];
                    if(field === 'prompt') newMessages[msgIndex].suggestions[contentIndex].prompt = translatedTexts[textIndex];
                }
                textIndex++;
            });
            
            setMessages(newMessages);
            setIsTranslating(false);
        };

        translateConversation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    const handleSuggestionClick = (prompt: string) => {
        handleSendMessage(prompt);
    };

    const handleInitialAction = (prompt: string) => {
        setInput(prompt);
        handleSendMessage(prompt);
    };

    const handleImageCapture = (imageDataUrl: string) => {
        setCapturedImage(imageDataUrl);
        setShowCamera(false);
        handleSendMessage(t('analyzeImagePrompt'), imageDataUrl);
    };

    const handleDashboardExplain = (prompt: string) => {
        handleSendMessage(prompt);
    };
    
    const parseMarkdown = (text: string) => {
        // Configure marked to handle lists and bold text as requested by geminiService prompt
        return marked.parse(text, { breaks: true });
    };

    if (!hasSelectedLanguage) {
        return <LanguageSelector onLanguageSelect={() => setHasSelectedLanguage(true)} />;
    }

    return (
        <div className="flex h-screen bg-white dark:bg-[#1A221E] text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
            {/* Dashboard Panel */}
            <div className={`transition-all duration-500 ease-in-out h-full flex flex-col ${showDashboard ? 'w-full lg:w-3/5 xl:w-2/3' : 'w-0'}`}>
                {showDashboard && (
                    <Dashboard 
                        onExplain={handleDashboardExplain}
                        moisture={moisture} setMoisture={setMoisture}
                        isIrrigating={isIrrigating} setIsIrrigating={setIsIrrigating}
                        isDraining={isDraining} setIsDraining={setIsDraining}
                        weather={weather} setWeather={setWeather}
                        phValue={phValue} setPhValue={setPhValue}
                        npkValues={npkValues} setNpkValues={setNpkValues}
                    />
                )}
            </div>
            
            {/* Chat Panel */}
            <div className={`flex flex-col h-full bg-slate-50 dark:bg-[#1A221E] shadow-2xl transition-all duration-500 ease-in-out ${showDashboard ? 'w-full lg:w-2/5 xl:w-1/3' : 'w-full'}`}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <LogoIcon className="w-10 h-10" />
                        <div>
                            <h1 className="text-lg font-bold text-[#4A5C50] dark:text-slate-100">
                                Green<span style={{ color: '#D4A22E' }}>Gold</span>
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('aiAssistant')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
                        <button 
                            onClick={() => setShowDashboard(!showDashboard)}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                            title={showDashboard ? t('closeDashboard') : t('openDashboard')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                     {isTranslating && (
                        <div className="absolute inset-0 bg-slate-50/80 dark:bg-[#1A221E]/80 flex flex-col items-center justify-center z-10">
                            <Spinner className="w-8 h-8 text-[#D4A22E]" />
                            <p className="ml-2 mt-2 text-sm font-medium">{t('translatingConversation')}</p>
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === Sender.AI && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A5C50] to-[#38483E] flex-shrink-0 flex items-center justify-center"><LogoIcon className="w-6 h-6" /></div>}
                            <div className={`max-w-sm md:max-w-md ${msg.sender === Sender.USER ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div className={`p-3 rounded-2xl relative ${msg.sender === Sender.USER ? 'bg-[#D4A22E] text-white rounded-br-none' : 'bg-white dark:bg-[#202a25] text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                                    {msg.image && <img src={msg.image} alt="user upload" className="rounded-lg mb-2 max-h-48"/>}
                                    {msg.content.map((part, index) => {
                                        if (part.type === 'text') {
                                            return <div key={index} className="prose prose-sm dark:prose-invert max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: part.value ? parseMarkdown(part.value) : '' }} />;
                                        }
                                        if (part.type === 'visualization' && part.data) {
                                            return part.data.type === 'bar' 
                                                ? <BarChart key={index} vizData={part.data} />
                                                : <PieChart key={index} vizData={part.data} />;
                                        }
                                        return null;
                                    })}
                                     {msg.sender === Sender.AI && msg.content.some(c => c.type === 'text' && c.value) && (
                                        <TTSButton text={msg.content.filter(c => c.type === 'text').map(c => c.value).join(' ')} />
                                    )}
                                </div>
                                {msg.suggestions && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {msg.suggestions.map((sugg: TopicSuggestion, i) => (
                                            <button key={i} onClick={() => handleSuggestionClick(sugg.prompt)} className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">{sugg.title}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                             {msg.sender === Sender.USER && <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-500" /></div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A5C50] to-[#38483E] flex-shrink-0 flex items-center justify-center"><LogoIcon className="w-6 h-6" /></div>
                            <div className="p-3 rounded-2xl bg-white dark:bg-[#202a25] rounded-bl-none flex items-center">
                                <Spinner className="w-5 h-5 text-[#D4A22E]" />
                            </div>
                        </div>
                    )}
                    {messages.length === 0 && <InitialActions onAction={handleInitialAction} />}
                    <div ref={chatEndRef}></div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 flex-shrink-0">
                    <div className="relative">
                        {capturedImage && (
                            <div className="absolute bottom-full left-0 mb-2 p-1 bg-white dark:bg-[#202a25] rounded-lg shadow-md">
                                <img src={capturedImage} alt="thumbnail" className="h-16 w-16 object-cover rounded" />
                                <button onClick={() => setCapturedImage(null)} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(input, capturedImage || undefined);
                                }
                            }}
                            placeholder={t('inputPlaceholder')}
                            className="w-full p-3 pr-24 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#202a25] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none resize-none"
                            rows={1}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                             <button
                                onClick={() => setShowCamera(true)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                                title={t('attachImage')}
                             >
                                <PhotoIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => handleSendMessage(input, capturedImage || undefined)}
                                disabled={isLoading || (!input.trim() && !capturedImage)}
                                className="p-2 rounded-full bg-[#D4A22E] text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
                            >
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleImageCapture} />}
        </div>
    );
};

export default App;