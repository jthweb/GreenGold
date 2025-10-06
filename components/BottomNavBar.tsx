import React from 'react';
import { HomeIcon, ChatIcon, SettingsIcon, LogIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

type ActiveView = 'dashboard' | 'chat';

interface BottomNavBarProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
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
        className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-all duration-300 ease-out transform ${isActive ? ' text-[#D4A22E]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
        <div className={`relative transition-all duration-300 ease-out ${isActive ? '-translate-y-2' : 'translate-y-0'}`}>
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-[#D4A22E] rounded-full transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
            <Icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-semibold transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 -translate-y-1'}`}>{label}</span>
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
                    icon={ChatIcon}
                    isActive={activeView === 'chat'}
                    onClick={() => setActiveView('chat')}
                />
                 <NavButton
                    label={t('logs')}
                    icon={LogIcon}
                    isActive={false} // This is a modal trigger, not a view
                    onClick={onLogsClick}
                />
                 <NavButton
                    label={t('settings')}
                    icon={SettingsIcon}
                    isActive={false} // This is a modal trigger, not a view
                    onClick={onSettingsClick}
                />
            </div>
        </div>
    );
};

export default BottomNavBar;