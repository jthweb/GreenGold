import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { LogoIcon, ChatBubbleLeftRightIcon, ClipboardDocumentListIcon, CameraIcon } from './Icons';

interface OnboardingScreenProps {
    onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const { t } = useLocalization();
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: LogoIcon,
            title: t('onboardingTitle1'),
            description: t('onboardingDesc1'),
        },
        {
            icon: ChatBubbleLeftRightIcon,
            title: t('onboardingTitle2'),
            description: t('onboardingDesc2'),
        },
        {
            icon: CameraIcon,
            title: t('onboardingTitle3'),
            description: t('onboardingDesc3'),
        },
        {
            icon: ClipboardDocumentListIcon,
            title: t('onboardingTitle4'),
            description: t('onboardingDesc4'),
        },
    ];

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-[#141615] flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-md text-center">
                <div className="bg-white dark:bg-[#202a25] rounded-xl shadow-lg p-8">
                    <currentStep.icon className="w-20 h-20 mx-auto mb-6 text-[#D4A22E]" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{currentStep.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">{currentStep.description}</p>
                    
                    <div className="flex items-center justify-center gap-3 mb-6">
                        {steps.map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full transition-colors ${step === index ? 'bg-[#D4A22E]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        ))}
                    </div>

                    <button onClick={handleNext} className="w-full bg-[#D4A22E] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                        {step < steps.length - 1 ? t('next') : t('getStarted')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;
