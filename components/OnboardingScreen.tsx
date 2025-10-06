import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { User, OnboardingDetails } from '../types';
import { LogoIcon } from './Icons';

interface OnboardingScreenProps {
    user: User;
    onComplete: (details: OnboardingDetails) => void;
}

const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 my-6">
        <div 
            className="bg-[#D4A22E] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(current / total) * 100}%` }}
        ></div>
    </div>
);

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ user, onComplete }) => {
    const { t } = useLocalization();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [farmName, setFarmName] = useState('');
    const [farmSize, setFarmSize] = useState('');
    const [primaryCrops, setPrimaryCrops] = useState('');
    const totalSteps = 2;

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete({
            name,
            farmName,
            farmSize: Number(farmSize),
            primaryCrops
        });
    };
    
    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-[#141615] flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
             <div className="w-full max-w-md">
                <LogoIcon className="w-20 h-20 mx-auto mb-4" />
                <div className="bg-white dark:bg-[#202a25] rounded-xl shadow-lg p-6">
                    <ProgressBar current={step} total={totalSteps} />
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="animate-fade-in text-center">
                                <h1 className="text-2xl font-bold text-[#4A5C50] dark:text-slate-200">{t('onboardingPersonalTitle')}</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6">{t('farmSetupDescription')}</p>
                                <div className="text-left">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('yourName')}</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder={t('yourNamePlaceholder')}
                                        required
                                        className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                                    />
                                </div>
                                <button type="button" onClick={handleNext} className="w-full bg-[#D4A22E] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity mt-6">
                                    {t('next')}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                             <div className="animate-fade-in">
                                <h1 className="text-2xl font-bold text-center text-[#4A5C50] dark:text-slate-200 mb-6">{t('onboardingFarmTitle')}</h1>
                                <div className="space-y-4 text-left">
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
                                    <div className="flex gap-2 pt-2">
                                        <button type="button" onClick={handleBack} className="w-1/2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                            {t('back')}
                                        </button>
                                        <button type="submit" className="w-1/2 bg-[#D4A22E] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                            {t('finishSetup')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;