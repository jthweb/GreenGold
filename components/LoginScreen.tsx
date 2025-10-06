import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useUser } from '../hooks/useUser';
import { LogoIcon, EyeIcon, EyeSlashIcon } from './Icons';

type AuthMode = 'login' | 'signup';

const LoginScreen: React.FC = () => {
    const { t } = useLocalization();
    const { login, signUp } = useUser();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        let success = false;
        if (mode === 'login') {
            success = login(email, password);
            if (!success) setError(t('loginError'));
        } else {
            success = signUp(email, password);
            if (!success) setError(t('signUpError'));
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-[#141615] flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-sm">
                <LogoIcon className="w-20 h-20 mx-auto mb-6" />
                <div className="bg-white dark:bg-[#202a25] rounded-xl shadow-lg p-6">
                    <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                        <button
                            onClick={() => { setMode('login'); setError(null); }}
                            className={`w-1/2 pb-3 font-semibold text-center transition-colors ${mode === 'login' ? 'text-[#D4A22E] border-b-2 border-[#D4A22E]' : 'text-slate-500 dark:text-slate-400'}`}
                        >{t('login')}</button>
                        <button
                            onClick={() => { setMode('signup'); setError(null); }}
                            className={`w-1/2 pb-3 font-semibold text-center transition-colors ${mode === 'signup' ? 'text-[#D4A22E] border-b-2 border-[#D4A22E]' : 'text-slate-500 dark:text-slate-400'}`}
                        >{t('signUp')}</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('password')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="mt-1 w-full p-3 pr-10 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] focus:border-transparent outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 dark:text-slate-400"
                                    title={showPassword ? t('hidePassword') : t('showPassword')}
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <button type="submit" className="w-full bg-[#D4A22E] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                            {mode === 'login' ? t('login') : t('signUp')}
                        </button>
                    </form>
                </div>
                 <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                    {mode === 'login' ? t('noAccount') : t('haveAccount')}
                    <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-[#D4A22E] hover:underline ml-1">
                       {mode === 'login' ? t('signUp') : t('login')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;