import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (keyPath: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLangState] = useState<Language>(() => {
        const saved = localStorage.getItem('app_language');
        return (saved === 'en' || saved === 'hi' || saved === 'te') ? saved : 'en';
    });

    const setLanguage = (lang: Language) => {
        setLangState(lang);
        localStorage.setItem('app_language', lang);
    };

    const t = (keyPath: string, params?: Record<string, string>) => {
        const keys = keyPath.split('.');
        let value: any = translations[language];

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${keyPath} for language: ${language}`);
                return keyPath;
            }
        }

        if (typeof value !== 'string') {
            return value;
        }

        let result = value;
        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                result = result.replace(new RegExp(`{${key}}`, 'g'), val);
            });
        }
        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
