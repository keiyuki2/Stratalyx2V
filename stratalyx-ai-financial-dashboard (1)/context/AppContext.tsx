import { createContext, useContext } from 'react';
import { Language, ToastMessage, ToastLevel } from '../types';

// --- App Context for Language ---
export interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    toasts: ToastMessage[];
    addToast: (message: string, level: ToastLevel) => void;
    removeToast: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};