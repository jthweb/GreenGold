import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, NPKValues, Sender, TopicSuggestion, WeatherCondition, MessageContent, FarmDetails } from './types';
import { getGeminiResponse, translateTexts } from './services/geminiService';
import { getRuleBasedResponse } from './services/ruleBasedService';
import { useLocalization } from './hooks/useLocalization';
import { useUser } from './hooks/useUser';

import LanguageSelector from './components/LanguageSelector';
import LoginScreen from './components/LoginScreen';
import OnboardingScreen from './components/OnboardingScreen';
import Dashboard from './components/Dashboard';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Spinner from './components/Spinner';
import CameraCapture from './components/CameraCapture';
import InitialActions from './components/InitialActions';
import TTSButton from './components/TTSButton';
import LanguageSwitcher from './components/LanguageSwitcher';
import BottomNavBar from './components/BottomNavBar';
import Header from './components/Header';
import LogModal from './components/LogModal';
import { marked } from 'marked';

import { AIAgentIcon, UserIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon, UploadIcon, MicrophoneIcon } from './components/Icons';

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

type MobileView = 'dashboard' | 'chat';
type AppState = 'LANGUAGE_SELECT' | 'AUTH' | 'ONBOARDING' | 'MAIN_APP';

const ModalPlaceholder: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => {
    const { t } = useLocalization();
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-[#202a25] rounded-lg shadow-xl p-6 text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-[#D4A22E] mb-2">{title}</h2>
                <p>{title} {t('comingSoon')}</p>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    // Context and State Hooks
    const { t, language, setLanguage } = useLocalization();
    const { user, login, logout, needsOnboarding, completeOnboarding } = useUser();
    
    // App Flow State
    const [appState, setAppState] = useState<AppState>('LANGUAGE_SELECT');

    // UI State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
    // View management
    const [activeView, setActiveView] = useState<MobileView>('dashboard');
    const [showSettings, setShowSettings] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    // Dashboard state - This will be loaded from user's saved state
    const [moisture, setMoisture] = useState(75);
    const [isIrrigating, setIsIrrigating] = useState(false);
    const [isDraining, setIsDraining] = useState(false);
    const [weather, setWeather] = useState<WeatherCondition>('cloudy');
    const [phValue, setPhValue] = useState(6.2);
    const [npkValues, setNpkValues] = useState<NPKValues>({ n: 13, p: 7, k: 12 });
    const [salinity, setSalinity] = useState(1.8);

    // Image capture and upload state
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Speech-to-text state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);
    
    // Determine app state based on user status
    useEffect(() => {
        if (appState === 'LANGUAGE_SELECT') return; // Wait for language selection
        if (!user) {
            setAppState('AUTH');
        } else if (needsOnboarding) {
            setAppState('ONBOARDING');
        } else {
            setAppState('MAIN_APP');
            // TODO: Load user's saved farm state from localStorage here
        }
    }, [user, needsOnboarding, appState]);

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
        if (!user) return; // Should not happen if UI is correct

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
        
        if (window.innerWidth < 1024) {
            setActiveView('chat');
        }

        const ruleResponse = getRuleBasedResponse(prompt, language);
        if (ruleResponse) {
             const enrichedResponse: ChatMessage = {
                ...ruleResponse,
                content: ruleResponse.content.map(c => ({ ...c, originalValue: c.value }))
            };
            setTimeout(() => {
                setMessages(prev => [...prev, enrichedResponse]);
                setIsLoading(false);
            }, 500);
            return;
        }

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
- Farm Profile: ${user.farmSize} Hectare farm named "${user.farmName}".
- Primary Crops: ${user.primaryCrops}.
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
    }, [language, t, moisture, weather, phValue, npkValues, salinity, isIrrigating, user]);
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition: SpeechRecognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;
        recognition.onstart = () => { setIsListening(true); setSpeechError(null); };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => { setSpeechError(t('speechError')); setIsListening(false); };
        recognition.onresult = (event: SpeechRecognitionEvent) => handleSendMessage(event.results[0][0].transcript);
        recognitionRef.current = recognition;
    }, [language, handleSendMessage, t]);

    const handleToggleListening = () => {
        if (isListening) recognitionRef.current?.stop();
        else recognitionRef.current?.start();
    };

    useEffect(() => {
        if (isInitialMount.current || messages.length === 0) { isInitialMount.current = false; return; }
        (async () => {
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
            const newMessages = JSON.parse(JSON.stringify(messages));
            let textIndex = 0;
            translationMap.forEach(mapInfo => {
                const { msgIndex, type, contentIndex, field } = mapInfo;
                if (type === 'content') newMessages[msgIndex].content[contentIndex].value = translatedTexts[textIndex];
                else if (type === 'suggestion') {
                    if(field === 'title') newMessages[msgIndex].suggestions[contentIndex].title = translatedTexts[textIndex];
                    if(field === 'prompt') newMessages[msgIndex].suggestions[contentIndex].prompt = translatedTexts[textIndex];
                }
                textIndex++;
            });
            setMessages(newMessages);
            setIsTranslating(false);
        })();
    }, [language]);

    const handleSuggestionClick = (prompt: string) => handleSendMessage(prompt);
    const handleInitialAction = (prompt: string) => handleSendMessage(prompt);
    const handleImageCapture = (imageDataUrl: string) => {
        setCapturedImage(imageDataUrl); setShowCamera(false);
        handleSendMessage(t('analyzeImagePrompt'), imageDataUrl);
    };
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => handleImageCapture(e.target?.result as string);
            reader.readAsDataURL(file);
        }
        if(event.target) event.target.value = '';
    };
    const handleDashboardExplain = (prompt: string) => handleSendMessage(prompt);
    const parseMarkdown = (text: string) => marked.parse(text, { breaks: true });

    // Render based on app state
    if (appState === 'LANGUAGE_SELECT') return <LanguageSelector onLanguageSelect={() => setAppState('AUTH')} />;
    if (appState === 'AUTH') return <LoginScreen />;
    if (appState === 'ONBOARDING' && user) return <OnboardingScreen user={user} onComplete={completeOnboarding} />;

    return (
        <div className="h-screen bg-white dark:bg-[#1A221E] text-slate-800 dark:text-slate-200 font-sans flex flex-col lg:flex-row overflow-hidden">
             <Header onToggleTheme={toggleTheme} theme={theme} onLogout={logout} />
            <main className="flex-1 flex lg:flex-row overflow-hidden pt-16 lg:pt-0">
                {/* Dashboard Panel */}
                <div className={`h-full flex-shrink-0 transition-all duration-300 ease-in-out ${activeView === 'dashboard' ? 'w-full animate-fade-in-fast' : 'w-0 hidden'} lg:w-3/5 xl:w-2/3 lg:flex flex-col`}>
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
                
                {/* Chat Panel */}
                <div className={`flex flex-col h-full bg-slate-50 dark:bg-[#1A221E] lg:shadow-2xl transition-all duration-300 ease-in-out flex-grow ${activeView === 'chat' ? 'w-full animate-fade-in-fast' : 'w-0 hidden'} lg:flex`}>
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <AIAgentIcon className="w-10 h-10 text-[#4A5C50] dark:text-slate-100" />
                            <div>
                                <h1 className="text-lg font-bold text-[#4A5C50] dark:text-slate-100">{t('aiAssistant')}</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.farmName || 'GreenGold'}</p>
                            </div>
                        </div>
                        <LanguageSwitcher onLanguageChange={setLanguage} />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative pb-20 lg:pb-4">
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
                                        {msg.content.map((part, index) => (
                                            part.type === 'text' ? <div key={index} className="prose prose-sm dark:prose-invert max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: part.value ? parseMarkdown(part.value) : '' }} /> :
                                            part.type === 'visualization' && part.data ? (part.data.type === 'bar' ? <BarChart key={index} vizData={part.data} /> : <PieChart key={index} vizData={part.data} />) : null
                                        ))}
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
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A5C50] to-[#38483E] flex-shrink-0 flex items-center justify-center"><LogoIcon className="w-6 h-6 animate-subtle-pulse" /></div>
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
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(input, capturedImage || undefined); }}}
                                placeholder={t('inputPlaceholder')}
                                className="w-full p-3 pr-40 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#202a25] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none resize-none"
                                rows={1}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button onClick={handleToggleListening} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400" title={t('speak')}>
                                    {isListening ? <Spinner className="w-6 h-6 text-red-500" /> : <MicrophoneIcon className="w-6 h-6" />}
                                </button>
                                <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400" title={t('attachFile')}>
                                    <UploadIcon className="w-6 h-6" />
                                </button>
                                <button onClick={() => setShowCamera(true)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400" title={t('attachImage')}>
                                    <PhotoIcon className="w-6 h-6" />
                                </button>
                                <button onClick={() => handleSendMessage(input, capturedImage || undefined)} disabled={isLoading || (!input.trim() && !capturedImage)} className="p-2 rounded-full bg-[#D4A22E] text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors">
                                    <PaperAirplaneIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNavBar activeView={activeView} setActiveView={setActiveView} onSettingsClick={() => setShowSettings(true)} onLogsClick={() => setShowLogs(true)} />
            
            {showSettings && <ModalPlaceholder title={t('settings')} onClose={() => setShowSettings(false)} />}
            {showLogs && <LogModal 
                onClose={() => setShowLogs(false)} 
                farmState={{ moisture, weather, phValue, npkValues, salinity }}
            />}

            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
            {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleImageCapture} />}
        </div>
    );
};

export default App;