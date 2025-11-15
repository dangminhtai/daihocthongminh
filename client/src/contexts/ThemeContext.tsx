
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getSettings, updateSettings } from '../services/settingsService';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, rawSetTheme] = useState<Theme>('system');

    useEffect(() => {
        const fetchAndSetTheme = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const settings = await getSettings();
                    rawSetTheme(settings.theme);
                    applyTheme(settings.theme);
                } catch (error) {
                    console.error("Failed to fetch theme settings, using system default.", error);
                    applyTheme('system');
                }
            } else {
                // No user logged in, just use system theme
                applyTheme('system');
            }
        };

        fetchAndSetTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme(theme);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);


    const setTheme = useCallback((newTheme: Theme) => {
        rawSetTheme(newTheme);
        applyTheme(newTheme);

        const token = localStorage.getItem('token');
        if (token) {
            updateSettings(newTheme).catch(error => {
                console.error("Failed to save theme settings:", error);
            });
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
