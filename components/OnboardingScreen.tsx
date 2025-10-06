import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { User, FarmDetails } from '../types';
import { LogoIcon } from './Icons';

interface OnboardingScreenProps {
    user: User;
    onComplete: (details: FarmDetails) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ user, onComplete }) => {
    const { t } = useLocalization();
    const [farmName, setFarmName] = useState('');
    const [farmSize, setFarmSize] = useState('');
    const [primaryCrops, setPrimaryCrops] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete({
            farmName,
            farmSize: Number(farmSize),
            primaryCrops
        });
    };
    
    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-[#141615] flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
             <div className="w-full max-w-md">
                <LogoIcon className="w-20 h-20 mx-auto mb-6" />
                <div className="bg-white dark:bg-[#202a25] rounded-xl shadow-lg p-6 text-center">
                    <h1 className="text-2xl font-bold text-[#4A5C50] dark:text-slate-200">{t('farmSetup')}</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6">{t('farmSetupDescription')}</p>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmName')}</label>
                            <input
                                type="text"
                                value={farmName}
                                onChange={e => setFarmName(e.target.value)}
                                placeholder={t('farmNamePlaceholder')}
                                required
                                className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmSize')}</label>
                            <input
                                type="number"
                                value={farmSize}
                                onChange={e => setFarmSize(e.target.value)}
                                placeholder="50"
                                required
                                className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmCrops')}</label>
                            <input
                                type="text"
                                value={primaryCrops}
                                onChange={e => setPrimaryCrops(e.target.value)}
                                placeholder={t('farmCropsPlaceholder')}
                                required
                                className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#D4A22E] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity mt-2">
                            {t('finishSetup')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;