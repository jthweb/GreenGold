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

// FIX: Import icons to resolve 'Cannot find name' errors.
import { AIAgentIcon, UserIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon, UploadIcon, MicrophoneIcon, LogoIcon, CameraIcon } from './components/Icons';

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
    const { t, language, setLanguage, isLoaded } = useLocalization();
    const { user, needsOnboarding, completeOnboarding, logout } = useUser();
    
    // App State Management
    const [appState, setAppState] = useState<AppState>('LANGUAGE_SELECT');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isTranslating, setIsTranslating] = useState(false);
    
    // UI State
    const [isDashboardVisible, setIsDashboardVisible] = useState(true);
    const [mobileView, setMobileView] = useState<MobileView>('dashboard');
    const [showCamera, setShowCamera] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showLogsModal, setShowLogsModal] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageToSend, setImageToSend] = useState<string | null>(null);

    // Dashboard State
    const [moisture, setMoisture] = useState(75);
    const [isIrrigating, setIsIrrigating] = useState(false);
    const [isDraining, setIsDraining] = useState(false);
    const [weather, setWeather] = useState<WeatherCondition>('sunny');
    const [phValue, setPhValue] = useState(6.8);
    const [npkValues, setNpkValues] = useState<NPKValues>({ n: 18, p: 9, k: 15 });
    const [salinity, setSalinity] = useState(1.8);

    // Speech Recognition State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Determine app state
    useEffect(() => {
        if (!isLoaded) {
            setAppState('LANGUAGE_SELECT');
        } else if (!user) {
            setAppState('AUTH');
        } else if (needsOnboarding) {
            setAppState('ONBOARDING');
        } else {
            setAppState('MAIN_APP');
        }
    }, [isLoaded, user, needsOnboarding]);

    // Theme effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

    // Auto-scroll chat effect
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Speech recognition setup
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            const recognition = new SpeechRecognitionAPI();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language;
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setInput(prev => prev + finalTranscript);
                }
            };
             recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, [language]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInput('');
            recognitionRef.current?.start();
        }
        setIsListening(!isListening);
    };

    const translateConversation = useCallback(async (targetLanguage: string) => {
        setIsTranslating(true);
        const originalMessages = messages; // Keep a copy
        try {
            const textsToTranslate: string[] = [];
            const textIndices: { msgIndex: number; contentIndex: number }[] = [];

            messages.forEach((msg, msgIndex) => {
                msg.content.forEach((content, contentIndex) => {
                    if (content.type === 'text' && content.originalValue) {
                        textsToTranslate.push(content.originalValue);
                        textIndices.push({ msgIndex, contentIndex });
                    }
                });
                msg.suggestions?.forEach(suggestion => {
                     textsToTranslate.push(suggestion.originalTitle, suggestion.originalPrompt);
                });
            });

            if (textsToTranslate.length > 0) {
                const translatedTexts = await translateTexts(textsToTranslate, targetLanguage);
                
                let translatedIndex = 0;
                const newMessages = messages.map(msg => ({
                    ...msg,
                    content: msg.content.map(content => {
                        if (content.type === 'text' && content.originalValue) {
                            return { ...content, value: translatedTexts[translatedIndex++] };
                        }
                        return content;
                    }),
                    suggestions: msg.suggestions?.map(suggestion => ({
                        ...suggestion,
                        title: translatedTexts[translatedIndex++],
                        prompt: translatedTexts[translatedIndex++]
                    }))
                }));

                setMessages(newMessages);
            }
        } catch (error) {
            console.error("Translation failed, reverting:", error);
            setMessages(originalMessages); // Revert on failure
        } finally {
            setIsTranslating(false);
        }
    }, [messages]);

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
        translateConversation(langCode);
    };

    const handleSendMessage = useCallback(async (prompt?: string, attachedImage?: string) => {
        const messageText = prompt || input;
        if (!messageText.trim() && !attachedImage) return;

        setIsLoading(true);
        setInput('');
        
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: Sender.USER,
            content: [{ type: 'text', value: messageText }],
            image: attachedImage || imageToSend || undefined,
        };
        setMessages(prev => [...prev, userMessage]);

        // Prioritize rule-based responses for instant answers
        const ruleResponse = getRuleBasedResponse(messageText, language);
        if (ruleResponse) {
            setMessages(prev => [...prev, ruleResponse]);
            setIsLoading(false);
            setImageToSend(null);
            return;
        }

        // --- Prepare Farm Context for AI ---
        const farmContext = user ? `
        CURRENT FARM DATA:
        - Farm Name: ${user.farmName}
        - Farm Size: ${user.farmSize} hectares
        - Primary Crops: ${user.primaryCrops}
        - Soil Moisture: ${moisture.toFixed(1)}%
        - Weather: ${weather}
        - Soil pH: ${phValue.toFixed(1)}
        - NPK Levels: N=${npkValues.n}, P=${npkValues.p}, K=${npkValues.k}
        - Salinity (EC): ${salinity.toFixed(1)} dS/m
        ` : 'No farm data available.';

        // --- Call Gemini API ---
        const aiResponse = await getGeminiResponse(messageText, language, farmContext, userMessage.image);
        
        // Translate AI response if language is not English
        if (language !== 'en') {
             const textsToTranslate: string[] = [];
             aiResponse.content.forEach(c => { if(c.type === 'text' && c.value) textsToTranslate.push(c.value) });
             aiResponse.suggestions?.forEach(s => { textsToTranslate.push(s.title, s.prompt) });

             if (textsToTranslate.length > 0) {
                 const translated = await translateTexts(textsToTranslate, language);
                 let i = 0;
                 aiResponse.content.forEach(c => { if(c.type === 'text' && c.value) c.value = translated[i++] });
                 aiResponse.suggestions?.forEach(s => { s.title = translated[i++]; s.prompt = translated[i++] });
             }
        }

        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        setImageToSend(null);
    }, [input, imageToSend, language, user, moisture, weather, phValue, npkValues, salinity]);
    
    const handleImageCapture = (imageDataUrl: string) => {
        setShowCamera(false);
        handleSendMessage(t('analyzeImagePrompt'), imageDataUrl);
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                handleSendMessage(t('analyzeImagePrompt'), base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const renderContent = (content: MessageContent) => {
        if (content.type === 'visualization' && content.data) {
            if (content.data.type === 'bar') {
                return <BarChart vizData={content.data} />;
            }
            if (content.data.type === 'pie') {
                return <PieChart vizData={content.data} />;
            }
        }
        if (content.type === 'text' && content.value) {
            const htmlContent = marked.parse(content.value);
            return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent as string }} />;
        }
        return null;
    };
    
    const mainAppContent = (
        <div className="h-full flex flex-col lg:flex-row bg-white dark:bg-[#202a25]">
            <Header onToggleTheme={toggleTheme} theme={theme} onLogout={logout} />
            
            {/* Mobile View: Dashboard */}
            <div className={`lg:flex lg:w-1/2 xl:w-3/5 ${mobileView === 'dashboard' ? 'block' : 'hidden'}`}>
                <Dashboard
                    onExplain={handleSendMessage}
                    moisture={moisture}
                    setMoisture={setMoisture}
                    isIrrigating={isIrrigating}
                    setIsIrrigating={setIsIrrigating}
                    isDraining={isDraining}
                    setIsDraining={setIsDraining}
                    weather={weather}
                    setWeather={setWeather}
                    phValue={phValue}
                    setPhValue={setPhValue}
                    npkValues={npkValues}
                    setNpkValues={setNpkValues}
                    salinity={salinity}
                    setSalinity={setSalinity}
                />
            </div>

            {/* Mobile View: Chat */}
            <div className={`flex flex-col flex-1 lg:w-1/2 xl:w-2/5 ${mobileView === 'chat' ? 'block' : 'hidden lg:flex'}`}>
                {/* Chat Panel */}
                <div className="flex-1 overflow-y-auto p-4 pt-20 lg:pt-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === Sender.AI && (
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 ${isLoading && messages[messages.length - 1]?.id === msg.id ? 'animate-bounce' : ''}`}>
                                    <AIAgentIcon className={`w-6 h-6 text-slate-600 dark:text-slate-300 ${isLoading ? 'animate-pulse' : ''}`} />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg relative ${msg.sender === Sender.USER ? 'order-2' : ''}`}>
                                {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2" />}
                                <div className={`px-4 py-3 rounded-2xl ${msg.sender === Sender.AI ? 'bg-slate-100 dark:bg-[#2a3831] text-slate-800 dark:text-slate-100 rounded-bl-none' : 'bg-[#D4A22E] text-white rounded-br-none'}`}>
                                    {msg.content.map((c, i) => <div key={i}>{renderContent(c)}</div>)}
                                    {msg.sender === Sender.AI && <TTSButton text={msg.content.filter(c => c.type === 'text').map(c => c.value).join(' ')} />}
                                </div>
                                {msg.suggestions && (
                                    <div className="mt-2 space-y-1.5">
                                        {msg.suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSendMessage(s.prompt)}
                                                className="w-full text-left text-sm text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                {s.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {msg.sender === Sender.USER && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-600">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.sender === Sender.USER && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                                <AIAgentIcon className="w-6 h-6 text-slate-600 dark:text-slate-300 animate-[bounce_1.5s_infinite]" />
                            </div>
                            <div className="max-w-xs px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#2a3831] rounded-bl-none">
                                <Spinner className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </div>
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && <InitialActions onAction={handleSendMessage} />}
                    <div ref={chatEndRef}></div>
                </div>

                {imageToSend && (
                     <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="relative w-24 h-24">
                            <img src={imageToSend} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            <button onClick={() => setImageToSend(null)} className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-0.5">
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                 <div className="p-4 bg-white dark:bg-[#202a25] border-t border-slate-200 dark:border-slate-700/80">
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
                         <button onClick={toggleListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                            <MicrophoneIcon className="w-6 h-6" />
                        </button>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder={t('inputPlaceholder')}
                            rows={1}
                            className="flex-1 resize-none p-3 text-sm rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                        />
                         <label className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
                            <UploadIcon className="w-6 h-6" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button onClick={() => setShowCamera(true)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                            <CameraIcon className="w-6 h-6" />
                        </button>
                        <button onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()} className="p-3 rounded-full bg-[#D4A22E] text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors">
                            <PaperAirplaneIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-2">
                        Made by JThweb
                    </p>
                </div>
            </div>
            <BottomNavBar 
                activeView={mobileView} 
                setActiveView={setMobileView}
                onSettingsClick={() => setShowSettingsModal(true)}
                onLogsClick={() => setShowLogsModal(true)}
            />
        </div>
    );

    const renderAppState = () => {
        switch (appState) {
            case 'LANGUAGE_SELECT':
                return <LanguageSelector onLanguageSelect={() => setAppState('AUTH')} />;
            case 'AUTH':
                return <LoginScreen />;
            case 'ONBOARDING':
                return user ? <OnboardingScreen user={user} onComplete={completeOnboarding} /> : <LoginScreen />;
            case 'MAIN_APP':
                return mainAppContent;
            default:
                return <LanguageSelector onLanguageSelect={() => setAppState('AUTH')} />;
        }
    };
    
    return (
        <>
            {renderAppState()}
            {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleImageCapture} />}
            {showSettingsModal && <ModalPlaceholder title={t('settings')} onClose={() => setShowSettingsModal(false)} />}
            {showLogsModal && user && (
                <LogModal 
                    onClose={() => setShowLogsModal(false)} 
                    farmState={{ moisture, weather, phValue, npkValues, salinity }}
                />
            )}
            {isTranslating && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
                    <div className="bg-white dark:bg-[#202a25] rounded-lg p-6 flex items-center gap-4">
                        <Spinner />
                        <span className="font-semibold">{t('translatingConversation')}</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default App;