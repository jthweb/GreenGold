import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, NPKValues, Sender, WeatherCondition } from './types';
import { getGeminiResponse, translateTexts } from './services/geminiService';
import { getRuleBasedResponse } from './services/ruleBasedService';
import { useLocalization } from './hooks/useLocalization';
import { useUser } from './hooks/useUser';

import LanguageSelector from './components/LanguageSelector';
import LoginScreen from './components/LoginScreen';
import OnboardingScreen from './components/OnboardingScreen';
import Dashboard from './components/Dashboard';
import CameraCapture from './components/CameraCapture';
import BottomNavBar from './components/BottomNavBar';
import Header from './components/Header';
import ChatPanel from './components/ChatPanel';
import LogsPanel from './components/LogsPanel';
import SettingsPanel from './components/SettingsPanel';
import Spinner from './components/Spinner';

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

type AppView = 'main' | 'logs' | 'settings';
type MobileView = 'dashboard' | 'chat';

const App: React.FC = () => {
    // Context and State Hooks
    const { t, language, setLanguage } = useLocalization();
    const { user, needsOnboarding, completeOnboarding, logout } = useUser();
    
    // App State Management
    const [languageIsSelected, setLanguageIsSelected] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isTranslating, setIsTranslating] = useState(false);
    
    // UI State
    const [currentView, setCurrentView] = useState<AppView>('main');
    const [mobileView, setMobileView] = useState<MobileView>('dashboard');
    const [showCamera, setShowCamera] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            messages.forEach((msg) => {
                msg.content.forEach((content) => {
                    if (content.type === 'text' && content.originalValue) {
                        textsToTranslate.push(content.originalValue);
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

    const handleInitialLanguageSelect = (langCode: string) => {
        setLanguage(langCode);
        setLanguageIsSelected(true);
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
            image: attachedImage || undefined,
        };
        setMessages(prev => [...prev, userMessage]);

        const ruleResponse = getRuleBasedResponse(messageText, language);
        if (ruleResponse) {
            setMessages(prev => [...prev, ruleResponse]);
            setIsLoading(false);
            return;
        }

        const farmContext = user ? `
        CURRENT FARM DATA:
        - User's Name: ${user.name}
        - Farm Name: ${user.farmName}
        - Farm Size: ${user.farmSize} hectares
        - Primary Crops: ${user.primaryCrops}
        - Soil Moisture: ${moisture.toFixed(1)}%
        - Weather: ${weather}
        - Soil pH: ${phValue.toFixed(1)}
        - NPK Levels: N=${npkValues.n}, P=${npkValues.p}, K=${npkValues.k}
        - Salinity (EC): ${salinity.toFixed(1)} dS/m
        ` : 'No farm data available.';

        const aiResponse = await getGeminiResponse(messageText, language, farmContext, userMessage.image);
        
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
    }, [input, language, user, moisture, weather, phValue, npkValues, salinity]);
    
    const handleImageCapture = (imageDataUrl: string) => {
        setShowCamera(false);
        handleSendMessage(t('analyzeImagePrompt'), imageDataUrl);
    };
    
    const mainAppContent = (
        <div className="h-full flex flex-col lg:flex-row bg-white dark:bg-[#202a25] relative overflow-hidden">
            <Header onToggleTheme={toggleTheme} theme={theme} onLogout={logout} user={user} />
            
            <div className="flex-1 flex pt-16 lg:pt-0">
                {/* Desktop: Fixed Dashboard */}
                <div className="hidden lg:block lg:w-1/2 xl:w-3/5 border-r border-slate-200 dark:border-slate-800">
                    <Dashboard user={user} onExplain={handleSendMessage} moisture={moisture} setMoisture={setMoisture} isIrrigating={isIrrigating} setIsIrrigating={setIsIrrigating} isDraining={isDraining} setIsDraining={setIsDraining} weather={weather} setWeather={setWeather} phValue={phValue} setPhValue={setPhValue} npkValues={npkValues} setNpkValues={setNpkValues} salinity={salinity} setSalinity={setSalinity}/>
                </div>

                {/* Mobile: Sliding Page Views */}
                <div className="lg:hidden absolute top-16 bottom-16 left-0 right-0 overflow-hidden">
                    <div className={`absolute inset-0 transition-transform duration-300 ease-out ${mobileView === 'dashboard' ? 'translate-x-0' : '-translate-x-full'}`}>
                        <Dashboard user={user} onExplain={handleSendMessage} moisture={moisture} setMoisture={setMoisture} isIrrigating={isIrrigating} setIsIrrigating={setIsIrrigating} isDraining={isDraining} setIsDraining={setIsDraining} weather={weather} setWeather={setWeather} phValue={phValue} setPhValue={setPhValue} npkValues={npkValues} setNpkValues={setNpkValues} salinity={salinity} setSalinity={setSalinity} />
                    </div>
                    <div className={`absolute inset-0 transition-transform duration-300 ease-out ${mobileView === 'chat' ? 'translate-x-0' : 'translate-x-full'}`}>
                       <ChatPanel messages={messages} isLoading={isLoading} input={input} setInput={setInput} handleSendMessage={handleSendMessage} setShowCamera={setShowCamera} isListening={isListening} toggleListening={toggleListening} handleLanguageChange={handleLanguageChange} />
                    </div>
                </div>
                
                {/* Desktop: Fixed Chat */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5">
                    <ChatPanel messages={messages} isLoading={isLoading} input={input} setInput={setInput} handleSendMessage={handleSendMessage} setShowCamera={setShowCamera} isListening={isListening} toggleListening={toggleListening} handleLanguageChange={handleLanguageChange} />
                </div>
            </div>

            <BottomNavBar activeView={mobileView} setActiveView={setMobileView} onSettingsClick={() => setCurrentView('settings')} onLogsClick={() => setCurrentView('logs')} />
        </div>
    );

    const renderApp = () => {
        if (!languageIsSelected) {
            return <LanguageSelector onLanguageSelect={handleInitialLanguageSelect} />;
        }

        if (!user) {
            return <LoginScreen />;
        }

        if (needsOnboarding) {
            return <OnboardingScreen user={user} onComplete={completeOnboarding} />;
        }

        switch (currentView) {
            case 'logs':
                return <LogsPanel onBack={() => setCurrentView('main')} farmState={{ moisture, weather, phValue, npkValues, salinity }} />;
            case 'settings':
                return <SettingsPanel onBack={() => setCurrentView('main')} />;
            case 'main':
            default:
                return mainAppContent;
        }
    };
    
    return (
        <>
            {renderApp()}
            {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleImageCapture} />}
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