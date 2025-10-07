import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageContent, Sender } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { marked } from 'marked';
import BarChart from './BarChart';
import PieChart from './PieChart';
import Spinner from './Spinner';
import InitialActions from './InitialActions';
import TTSButton from './TTSButton';
import LanguageSwitcher from './LanguageSwitcher';
// FIX: Replaced UploadIcon with the available ArrowUpTrayIcon.
import { AIAgentIcon, UserIcon, PaperAirplaneIcon, ArrowUpTrayIcon, CameraIcon, MicrophoneIcon } from './Icons';

interface ChatPanelProps {
    messages: ChatMessage[];
    isLoading: boolean;
    input: string;
    setInput: (value: string) => void;
    handleSendMessage: (prompt?: string, image?: string) => void;
    setShowCamera: (show: boolean) => void;
    isListening: boolean;
    toggleListening: () => void;
    handleLanguageChange: (langCode: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    isLoading,
    input,
    setInput,
    handleSendMessage,
    setShowCamera,
    isListening,
    toggleListening,
    handleLanguageChange
}) => {
    const { t } = useLocalization();
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

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
        // Reset file input to allow uploading the same file again
        event.target.value = '';
    };

    const renderContent = (content: MessageContent) => {
        if (content.type === 'visualization' && content.data) {
            if (content.data.type === 'bar') return <BarChart vizData={content.data} />;
            if (content.data.type === 'pie') return <PieChart vizData={content.data} />;
        }
        if (content.type === 'text' && content.value) {
            const htmlContent = marked.parse(content.value);
            return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent as string }} />;
        }
        return null;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#202a25]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'} animate-slide-in-bottom`}>
                        {msg.sender === Sender.AI && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <AIAgentIcon className={`w-6 h-6 text-gray-600 dark:text-gray-300 ${isLoading && messages[messages.length - 1]?.id === msg.id ? 'animate-subtle-pulse' : ''}`} />
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg relative`}>
                            {msg.image && <img src={msg.image} alt="User upload" className="rounded-xl mb-2" />}
                            <div className={`px-4 py-3 rounded-2xl ${msg.sender === Sender.AI ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none' : 'bg-[#D4A22E] text-white rounded-br-none'}`}>
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
                    <div className="flex items-end gap-2 justify-start animate-slide-in-bottom">
                         <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <AIAgentIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 animate-subtle-pulse" />
                        </div>
                        <div className="max-w-xs px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-bl-none">
                            <Spinner className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                )}
                {messages.length === 0 && !isLoading && <InitialActions onAction={handleSendMessage} />}
                <div ref={chatEndRef}></div>
            </div>

            <div className="p-4 bg-white dark:bg-[#202a25] border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1">
                    <LanguageSwitcher onLanguageChange={handleLanguageChange} />
                     <button onClick={toggleListening} className={`p-2.5 rounded-full transition-colors text-slate-500 dark:text-slate-400 ${isListening ? 'bg-red-500/20 text-red-500' : 'hover:bg-slate-200 dark:hover:bg-slate-700/60'}`}>
                        <MicrophoneIcon className="w-5 h-5" />
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
                        className="flex-1 resize-none p-3 px-4 text-sm rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                    />
                     <label className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button onClick={() => setShowCamera(true)} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 transition-colors">
                        <CameraIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()} className="p-3 rounded-full bg-[#D4A22E] text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;