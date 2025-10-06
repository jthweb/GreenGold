import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { User } from '../types';
import { LogoIcon } from './Icons';
import { soilTypes } from '../constants/farmData';

interface OnboardingScreenProps {
    onComplete: (details: any) => void;
}

const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 my-6">
        <div 
            className="bg-[#D4A22E] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(current / total) * 100}%` }}
        ></div>
    </div>
);

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const { t } = useLocalization();
    const [step, setStep] = useState(1);
    const [details, setDetails] = useState({
        name: '',
        farmName: '',
        farmSize: '',
        primaryCrops: '',
        soilType: soilTypes[0]
    });
    const totalSteps = 3;

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({...prev, [name]: value }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete({
            ...details,
            farmSize: Number(details.farmSize)
        });
    };
    
    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-[#141615] flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
             <div className="w-full max-w-md">
                <LogoIcon className="w-20 h-20 mx-auto mb-4" />
                <div className="bg-white dark:bg-[#202a25] rounded-xl shadow-lg p-6">
                    <ProgressBar current={step} total={totalSteps} />
                    <form onSubmit={handleSubmit}>
                        <div key={step} className="animate-fade-in">
                            {step === 1 && (
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-[#4A5C50] dark:text-slate-200">{t('onboardingPersonalTitle')}</h1>
                                    <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6">{t('farmSetupDescription')}</p>
                                    <div className="text-left">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('yourName')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={details.name}
                                            onChange={handleChange}
                                            onKeyDown={handleKeyDown}
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
                                 <div>
                                    <h1 className="text-2xl font-bold text-center text-[#4A5C50] dark:text-slate-200 mb-6">{t('onboardingFarmTitle')}</h1>
                                    <div className="space-y-4 text-left">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmName')}</label>
                                            <input type="text" name="farmName" value={details.farmName} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={t('farmNamePlaceholder')} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmSize')}</label>
                                            <input type="number" name="farmSize" value={details.farmSize} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="50" required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none" />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button type="button" onClick={handleBack} className="w-1/2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                                {t('back')}
                                            </button>
                                            <button type="button" onClick={handleNext} className="w-1/2 bg-[#D4A22E] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                                {t('next')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {step === 3 && (
                                <div>
                                    <h1 className="text-2xl font-bold text-center text-[#4A5C50] dark:text-slate-200 mb-6">{t('onboardingSoilTitle')}</h1>
                                    <div className="space-y-4 text-left">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmCrops')}</label>
                                            <input type="text" name="primaryCrops" value={details.primaryCrops} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={t('farmCropsPlaceholder')} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('soilType')}</label>
                                            <select name="soilType" value={details.soilType} onChange={handleChange} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none appearance-none">
                                                {soilTypes.map(type => <option key={type} value={type}>{t(type.toLowerCase())}</option>)}
                                            </select>
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;