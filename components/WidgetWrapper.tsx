import React from 'react';
import { QuestionMarkCircleIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

interface WidgetWrapperProps {
  title: string;
  explanation: string;
  explanationPrompt: string;
  onExplain: (prompt: string) => void;
  children: React.ReactNode;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ title, children, explanation, explanationPrompt, onExplain }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-white dark:bg-[#202a25] rounded-xl shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
                <div className="relative group">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                        <p className="mb-2">{explanation}</p>
                        <button 
                            onClick={() => onExplain(explanationPrompt)}
                            className="w-full text-center px-3 py-1.5 bg-amber-500 rounded-md font-semibold text-white hover:bg-amber-600"
                        >
                           {t('knowMore')}
                        </button>
                        <svg className="absolute top-full right-3 h-2 w-4 text-slate-800" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1">
                {children}
            </div>
        </div>
    );
};

export default WidgetWrapper;
