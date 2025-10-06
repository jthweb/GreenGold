import React, { useState, useEffect } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

interface TTSButtonProps {
    text: string;
}

const TTSButton: React.FC<TTSButtonProps> = ({ text }) => {
    const { t, language } = useLocalization();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language; // Set the language for the utterance
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            setIsSpeaking(false);
        };
        utteranceRef.current = utterance;
        
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [text, language]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            window.speechSynthesis.cancel();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleToggleSpeech = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            if (utteranceRef.current) {
                // If speech is paused, resume it. Otherwise, start fresh.
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                } else {
                    window.speechSynthesis.speak(utteranceRef.current);
                }
                setIsSpeaking(true);
            }
        }
    };
    
    // Hide button if speech synthesis is not supported or text is empty
    if (!('speechSynthesis' in window) || !text) {
        return null;
    }

    return (
        <button 
            onClick={handleToggleSpeech} 
            className="absolute bottom-2 end-2 p-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={isSpeaking ? t('stopSpeaking') : t('speakMessage')}
        >
            {isSpeaking ? (
                <SpeakerXMarkIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            ) : (
                <SpeakerWaveIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            )}
        </button>
    );
};

export default TTSButton;
