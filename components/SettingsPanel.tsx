import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useUser } from '../hooks/useUser';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from './Icons';
import { soilTypes } from '../constants/farmData';
import { User } from '../types';

interface SettingsPanelProps {
    onBack: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onBack }) => {
    const { t } = useLocalization();
    const { user, updateUser } = useUser();
    
    const [details, setDetails] = useState({
        name: user?.name || '',
        farmName: user?.farmName || '',
        farmSize: user?.farmSize.toString() || '',
        primaryCrops: user?.primaryCrops || '',
        soilType: user?.soilType || soilTypes[0],
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isExiting, setIsExiting] = useState(false);

    const handleBack = () => {
        setIsExiting(true);
        setTimeout(onBack, 300); // Match animation duration
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedDetails: Partial<User> = {
            ...details,
            farmSize: Number(details.farmSize),
        };
        // Only include password in update if it was changed
        if (details.password) {
            updatedDetails.password = details.password;
        } else {
            // Ensure we don't send an empty password string
            delete updatedDetails.password;
        }
        
        updateUser(updatedDetails);
        setSuccessMessage(t('settingsSaved'));
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className={`absolute inset-0 bg-slate-100 dark:bg-[#141615] z-50 flex flex-col ${isExiting ? 'animate-view-slide-out' : 'animate-view-slide-in'}`}>
             <header className="flex-shrink-0 bg-white/80 dark:bg-[#202a25]/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50 h-16 flex items-center px-4">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-[#4A5C50] dark:text-slate-200 mx-auto">{t('settings')}</h2>
                <div className="w-10"></div> {/* Spacer */}
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
                    <h3 className="text-lg font-semibold">{t('personalInfo')}</h3>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('yourName')}</label>
                        <input type="text" name="name" value={details.name} onChange={handleChange} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] outline-none" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('password')}</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} name="password" value={details.password} onChange={handleChange} placeholder={t('passwordPlaceholder')} className="mt-1 w-full p-3 pr-10 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] outline-none" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
                                {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                            </button>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold pt-4">{t('farmDetails')}</h3>
                     <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmName')}</label>
                        <input type="text" name="farmName" value={details.farmName} onChange={handleChange} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] outline-none" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmSize')}</label>
                        <input type="number" name="farmSize" value={details.farmSize} onChange={handleChange} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] outline-none" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('farmCrops')}</label>
                        <input type="text" name="primaryCrops" value={details.primaryCrops} onChange={handleChange} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] outline-none" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('soilType')}</label>
                        <select name="soilType" value={details.soilType} onChange={handleChange} required className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] outline-none appearance-none">
                            {soilTypes.map(type => <option key={type} value={type}>{t(type.toLowerCase())}</option>)}
                        </select>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full py-3 rounded-lg bg-[#D4A22E] text-white font-bold transition hover:opacity-90">{t('saveChanges')}</button>
                    </div>
                </form>
                {successMessage && <div className="mt-4 text-center text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300 p-3 rounded-lg animate-fade-in">{successMessage}</div>}
                 <div className="mt-6">
                    <a href="/CHANGELOG.md" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition hover:opacity-90">
                        {t('viewChangelog')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;