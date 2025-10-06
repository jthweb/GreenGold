import React from 'react';
import { HomeIcon, ChatBubbleLeftEllipsisIcon, Cog6ToothIcon, ClipboardDocumentCheckIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

type MobileView = 'dashboard' | 'chat';

interface BottomNavBarProps {
    activeView: MobileView;
    setActiveView: (view: MobileView) => void;
    onSettingsClick: () => void;
    onLogsClick: () => void;
}

const NavButton: React.FC<{
    label: string;
    icon: React.FC<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ease-out ${isActive ? 'text-[#D4A22E]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
        <div className="relative h-7 w-7 flex items-center justify-center">
             <Icon className={`w-6 h-6 transition-transform duration-300 ease-out ${isActive ? '-translate-y-2' : ''}`} />
        </div>
        <span className={`text-xs font-bold absolute bottom-1 transition-opacity duration-300 ease-out ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
);


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView, onSettingsClick, onLogsClick }) => {
    const { t } = useLocalization();

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#202a25]/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700/50 shadow-t-lg z-30">
            <div className="flex justify-around items-start h-16">
                <NavButton
                    label={t('home')}
                    icon={HomeIcon}
                    isActive={activeView === 'dashboard'}
                    onClick={() => setActiveView('dashboard')}
                />
                 <NavButton
                    label={t('chat')}
                    icon={ChatBubbleLeftEllipsisIcon}
                    isActive={activeView === 'chat'}
                    onClick={() => setActiveView('chat')}
                />
                 <NavButton
                    label={t('logs')}
                    icon={ClipboardDocumentCheckIcon}
                    isActive={false}
                    onClick={onLogsClick}
                />
                 <NavButton
                    label={t('settings')}
                    icon={Cog6ToothIcon}
                    isActive={false}
                    onClick={onSettingsClick}
                />
            </div>
        </div>
    );
};

export default BottomNavBar;