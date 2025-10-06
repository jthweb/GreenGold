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

import { LogoIcon, UserIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon, SunIcon, MoonIcon, UploadIcon, MicrophoneIcon } from './components/Icons';

// FIX: Add type definitions for the browser's Speech Recognition API to resolve TypeScript errors.
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
    item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onstart: () => void;
    onend: () => void;
    start(): void;
    stop(): void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}


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
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Dashboard state
    const [moisture, setMoisture] = useState(75);
    const [isIrrigating, setIsIrrigating] = useState(false);
    const [isDraining, setIsDraining] = useState(false);
    const [weather, setWeather] = useState<WeatherCondition>('cloudy');
    const [phValue, setPhValue] = useState(6.2);
    const [npkValues, setNpkValues] = useState<NPKValues>({ n: 13, p: 7, k: 12 });
    const [salinity, setSalinity] = useState(1.8);

    // Image capture and upload state
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    // FIX: Define the 'showCamera' state variable that was missing.
    const [showCamera, setShowCamera] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Speech-to-text state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

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
        // On mobile, switch to chat view when a message is sent
        if (window.innerWidth < 1024) {
            setShowDashboard(false);
        }

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

        // If no match, construct context and call Gemini
        const phStatus = phValue < 6.5 ? t('acidic') : phValue > 7.0 ? t('alkaline') : t('ideal');
        const weatherData = {
            sunny: { text: t('sunny'), temp: '18°C', humidity: '65%', wind: '15 km/h' },
            cloudy: { text: t('cloudy'), temp: '14°C', humidity: '75%', wind: '20 km/h' },
            rainy: { text: t('rainy'), temp: '12°C', humidity: '88%', wind: '25 km/h' },
        };
        const currentWeatherData = weatherData[weather];

        const farmContext = `
---
CURRENT FARM DATA (This is a pre-prompt with live data):
- Farm Profile: 50 Hectare farm in the United Kingdom.
- Primary Crops: Wheat, Barley, Rapeseed.
- Weather: ${currentWeatherData.text}, ${currentWeatherData.temp}, ${currentWeatherData.humidity} Humidity, ${currentWeatherData.wind} Wind
- Soil Moisture: ${Math.round(moisture)}%
- Soil pH: ${phValue.toFixed(1)} (${phStatus})
- Soil Salinity (EC): ${salinity} dS/m (${t('slightlySaline')})
- NPK Levels: Nitrogen=${npkValues.n}, Phosphorus=${npkValues.p}, Potassium=${npkValues.k}
- Active Irrigation: ${isIrrigating ? 'Yes' : 'No'}
---
Based EXCLUSIVELY on the data above, please answer the user's question.
`;

        try {
            const aiResponse = await getGeminiResponse(prompt, language, farmContext, image);
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
    }, [language, t, moisture, weather, phValue, npkValues, salinity, isIrrigating]);
    
    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const recognition: SpeechRecognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;

        recognition.onstart = () => {
            setIsListening(true);
            setSpeechError(null);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error', event.error);
            setSpeechError(t('speechError'));
            setIsListening(false);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            handleSendMessage(transcript);
        };
        
        recognitionRef.current = recognition;
    }, [language, handleSendMessage, t]);

    const handleToggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };


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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target?.result as string;
                handleImageCapture(imageDataUrl); // Use the same flow as camera capture
            };
            reader.readAsDataURL(file);
        }
        // Reset file input to allow selecting the same file again
        if(event.target) event.target.value = '';
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
            {/* Dashboard Panel - visible on lg screens, toggled on mobile */}
            <div className={`transition-all duration-500 ease-in-out h-full flex flex-col flex-shrink-0 ${showDashboard ? 'w-full lg:w-3/5 xl:w-2/3' : 'w-0'}`}>
                <div className={`${showDashboard ? 'block' : 'hidden'} lg:block h-full`}>
                    <Dashboard 
                        onExplain={handleDashboardExplain}
                        moisture={moisture} setMoisture={setMoisture}
                        isIrrigating={isIrrigating} setIsIrrigating={setIsIrrigating}
                        isDraining={isDraining} setIsDraining={setIsDraining}
                        weather={weather} setWeather={setWeather}
                        phValue={phValue} setPhValue={setPhValue}
                        npkValues={npkValues} setNpkValues={setNpkValues}
                        salinity={salinity} setSalinity={setSalinity}
                    />
                </div>
            </div>
            
            {/* Chat Panel - always visible on lg, toggled on mobile */}
            <div className={`flex flex-col h-full bg-slate-50 dark:bg-[#1A221E] shadow-2xl transition-all duration-500 ease-in-out flex-grow ${showDashboard ? 'hidden lg:flex' : 'flex'}`}>
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
                        <button
                          onClick={toggleTheme}
                          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                        </button>
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
                        <div key={msg.id} className={`flex gap-3 animate-slide-in-bottom ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}>
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
                        <div className="flex gap-3 justify-start animate-slide-in-bottom">
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
                     {speechError && <p className="text-xs text-red-500 text-center mb-2">{speechError}</p>}
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
                            className="w-full p-3 pr-40 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#202a25] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none resize-none"
                            rows={1}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                             <button
                                onClick={handleToggleListening}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                                title={t('speak')}
                             >
                                {isListening ? <Spinner className="w-6 h-6 text-red-500" /> : <MicrophoneIcon className="w-6 h-6" />}
                            </button>
                             <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                                title={t('attachFile')}
                             >
                                <UploadIcon className="w-6 h-6" />
                            </button>
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
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                />
                {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleImageCapture} />}
            </div>
        </div>
    );
};

// FIX: Add default export for the App component.
export default App;