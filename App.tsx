import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from './hooks/useLocalization';
import { useUser } from './hooks/useUser';
import { ChatMessage, NPKValues, Sender, WeatherCondition } from './types';
import { generateResponse } from './services/geminiService';
import { getRuleBasedResponse } from './services/ruleBasedService';
import { farmData } from './constants/farmData';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChatPanel from './components/ChatPanel';
import LanguageSelector from './components/LanguageSelector';
import LoginScreen from './components/LoginScreen';
import OnboardingScreen from './components/OnboardingScreen';
import CameraCapture from './components/CameraCapture';
import BottomNavBar from './components/BottomNavBar';
import LogsPanel from './components/LogsPanel';
import SettingsPanel from './components/SettingsPanel';

type View = 'dashboard' | 'chat' | 'logs' | 'settings';

const App: React.FC = () => {
    const { language, setLanguage, isLoaded } = useLocalization();
    const { user, logout, isOnboarded, completeOnboarding } = useUser();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [showLanguageSelector, setShowLanguageSelector] = useState(!localStorage.getItem('selectedLanguage'));
    
    // App State
    const [view, setView] = useState<View>('dashboard');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    
    // Speech Recognition
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = React.useRef<any>(null);

    // Farm State
    const [moisture, setMoisture] = useState(farmData.moisture);
    const [weather, setWeather] = useState<WeatherCondition>(farmData.weather);
    const [phValue, setPhValue] = useState(farmData.phValue);
    const [npkValues, setNpkValues] = useState<NPKValues>(farmData.npkValues);
    const [salinity, setSalinity] = useState(farmData.salinity);
    const farmState = { moisture, weather, phValue, npkValues, salinity };


    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = language;
            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSendMessage(transcript);
            };
            recognitionRef.current = recognition;
        }
    }, [language]);


    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const handleToggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLanguageSelect = (langCode: string) => {
        setLanguage(langCode);
        localStorage.setItem('selectedLanguage', langCode);
        setShowLanguageSelector(false);
    };

    const handleSendMessage = useCallback(async (promptOverride?: string, image?: string) => {
        const textToSend = promptOverride || input;
        if (!textToSend.trim() && !image) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: Sender.USER,
            content: [{ type: 'text', value: textToSend }],
            image: image
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setView('chat');

        // Check rule-based system first
        const ruleBasedResponse = getRuleBasedResponse(textToSend, language);
        if (ruleBasedResponse) {
             setTimeout(() => {
                setMessages(prev => [...prev, ruleBasedResponse]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        const aiResponse = await generateResponse(textToSend, messages, image);
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);

    }, [input, messages, language]);

    const handleCapture = (imageDataUrl: string) => {
        setShowCamera(false);
        handleSendMessage('Analyze this image of my plant.', imageDataUrl);
    };

    if (!isLoaded) return null; // Wait for translations
    if (showLanguageSelector) return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
    if (!user) return <LoginScreen />;
    if (!isOnboarded) return <OnboardingScreen onComplete={completeOnboarding} />;

    return (
        <div className="bg-slate-100 dark:bg-[#141615] text-slate-800 dark:text-slate-100 min-h-screen font-sans flex flex-col md:flex-row">
            {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={handleCapture} />}
            
            <div className="hidden md:flex md:w-1/2 lg:w-2/5 xl:w-1/3 flex-col h-screen">
                <ChatPanel 
                    messages={messages}
                    isLoading={isLoading}
                    input={input}
                    setInput={setInput}
                    handleSendMessage={handleSendMessage}
                    setShowCamera={setShowCamera}
                    isListening={isListening}
                    toggleListening={toggleListening}
                    handleLanguageChange={setLanguage}
                />
            </div>
            
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <Header onToggleTheme={handleToggleTheme} theme={theme} onLogout={logout} user={user}/>
                <div className="flex-1 pt-16 pb-20 md:pb-0 overflow-y-auto">
                   {view === 'dashboard' && <Dashboard onExplain={handleSendMessage} farmState={farmState} setFarmState={{ setMoisture, setWeather, setPhValue, setNpkValues, setSalinity }} />}
                   {view === 'logs' && <LogsPanel onBack={() => setView('dashboard')} farmState={farmState} />}
                   {view === 'settings' && <SettingsPanel onLogout={logout} />}

                   <div className="md:hidden p-4">
                     {view === 'chat' && (
                         <div className="h-[calc(100vh-8rem)]">
                            <ChatPanel 
                                messages={messages}
                                isLoading={isLoading}
                                input={input}
                                setInput={setInput}
                                handleSendMessage={handleSendMessage}
                                setShowCamera={setShowCamera}
                                isListening={isListening}
                                toggleListening={toggleListening}
                                handleLanguageChange={setLanguage}
                            />
                         </div>
                     )}
                   </div>
                </div>
                <BottomNavBar currentView={view} setView={setView} />
            </main>
        </div>
    );
};

export default App;
