import React from 'react';
import { HomeIcon, ChatBubbleLeftRightIcon, ClipboardDocumentListIcon, Cog6ToothIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

type View = 'dashboard' | 'chat' | 'logs' | 'settings';

interface BottomNavBarProps {
    currentView: View;
    setView: (view: View) => void;
}

const NavButton: React.FC<{
    icon: React.FC<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full pt-2 pb-1 transition-colors">
        <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-[#D4A22E]' : 'text-slate-500 dark:text-slate-400'}`} />
        <span className={`text-xs font-medium ${isActive ? 'text-[#D4A22E]' : 'text-slate-600 dark:text-slate-300'}`}>
            {label}
        </span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setView }) => {
    const { t } = useLocalization();
    const navItems = [
        { id: 'dashboard', icon: HomeIcon, label: t('dashboard') },
        { id: 'chat', icon: ChatBubbleLeftRightIcon, label: t('chat') },
        { id: 'logs', icon: ClipboardDocumentListIcon, label: t('logs') },
        { id: 'settings', icon: Cog6ToothIcon, label: t('settings') },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#202a25]/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700/50 z-40 h-20">
            <div className="flex justify-around items-stretch h-full">
                {navItems.map(item => (
                    <NavButton
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.id}
                        onClick={() => setView(item.id as View)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNavBar;
