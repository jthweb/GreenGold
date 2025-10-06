import React from 'react';
import { WifiIcon, BeakerIcon, ClipboardDocumentListIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

interface InitialActionsProps {
    onAction: (prompt: string) => void;
}

const InitialActions: React.FC<InitialActionsProps> = ({ onAction }) => {
    const { t } = useLocalization();

    const initialActions = [
      { label: t('smartIrrigation'), prompt: t('smartIrrigationPrompt'), icon: WifiIcon, color: 'blue' },
      { label: t('salinityCheck'), prompt: t('salinityCheckPrompt'), icon: BeakerIcon, color: 'gray' },
      { label: t('fertigationPlan'), prompt: t('fertigationPlanPrompt'), icon: ClipboardDocumentListIcon, color: 'green' }
    ];

    return (
        <div className="mt-3 space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400 px-1">{t('initialGreeting')}</p>
            {initialActions.map((action) => {
                 const colors = {
                    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 dark:hover:bg-blue-900/40',
                    gray: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20 dark:hover:bg-slate-700/60',
                    green: 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-900/40',
                };
                const colorClass = colors[action.color as keyof typeof colors];

                return (
                    <button
                        key={action.label}
                        onClick={() => onAction(action.prompt)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-start transition-colors ${colorClass}`}
                    >
                        <action.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{action.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default InitialActions;