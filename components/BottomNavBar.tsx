import React from 'react';
import { HomeIcon, MicrophoneIcon, Cog6ToothIcon, DocumentTextIcon } from './Icons'; // Assuming chat uses Microphone icon or similar
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
        className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-all duration-300 transform ${isActive ? 'text-[#D4A22E] scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
        <Icon className="w-6 h-6" />
        <span className={`text-xs font-semibold ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
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
                    icon={MicrophoneIcon}
                    isActive={activeView === 'chat'}
                    onClick={() => setActiveView('chat')}
                />
                 <NavButton
                    label={t('logs')}
                    icon={DocumentTextIcon}
                    isActive={false} // This is a modal trigger, not a view
                    onClick={onLogsClick}
                />
                 <NavButton
                    label={t('settings')}
                    icon={Cog6ToothIcon}
                    isActive={false} // This is a modal trigger, not a view
                    onClick={onSettingsClick}
                />
            </div>
        </div>
    );
};

export default BottomNavBar;