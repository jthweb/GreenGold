import React from 'react';
import { HomeIcon, ChatBubbleLeftRightIcon, Cog8ToothIcon, ClipboardDocumentCheckIcon } from './Icons';
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
        className="relative flex flex-col items-center justify-center w-full h-16 transition-colors duration-300 ease-out focus:outline-none z-10"
        aria-label={label}
    >
        <Icon className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-[#D4A22E]' : 'text-slate-500 dark:text-slate-400'}`} />
        <span className={`text-xs font-bold transition-all duration-300 ${isActive ? 'opacity-100 text-[#D4A22E]' : 'opacity-0 -translate-y-1'}`}>{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView, onSettingsClick, onLogsClick }) => {
    const { t } = useLocalization();
    const navItems = [
        { id: 'dashboard', label: t('home'), icon: HomeIcon, action: () => setActiveView('dashboard') },
        { id: 'chat', label: t('chat'), icon: ChatBubbleLeftRightIcon, action: () => setActiveView('chat') },
        { id: 'logs', label: t('logs'), icon: ClipboardDocumentCheckIcon, action: onLogsClick },
        { id: 'settings', label: t('settings'), icon: Cog8ToothIcon, action: onSettingsClick },
    ];

    const activeIndex = navItems.findIndex(item => item.id === activeView);

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#202a25]/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700/50 z-30">
            <div className="relative flex justify-around items-start h-full">
                <div 
                    className="absolute top-1/2 -translate-y-1/2 h-10 w-20 bg-amber-400/10 dark:bg-amber-400/5 rounded-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(calc(${activeIndex * 100}% - 50% + 12.5%))` }}
                />
                {navItems.map(item => (
                    <NavButton
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeView === item.id}
                        onClick={item.action}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNavBar;