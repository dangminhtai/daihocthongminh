import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IUser } from '../class/types';
import { useNavigate } from 'react-router-dom';
import { Settings, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, Theme } from '../contexts/ThemeContext';

interface SettingsPageProps {
  currentUser: IUser;
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const ThemeToggle = () => {
        const options: { name: Theme; icon: React.ReactNode }[] = [
          { name: 'light', icon: <Sun className="w-5 h-5" /> },
          { name: 'dark', icon: <Moon className="w-5 h-5" /> },
          { name: 'system', icon: <Laptop className="w-5 h-5" /> },
        ];
        return (
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Sun className="w-4 h-4 text-gray-500" /> Giao diện
            </label>
            <div className="flex items-center p-1 space-x-1 bg-gray-200 dark:bg-slate-700 rounded-lg">
              {options.map(option => (
                <button
                  key={option.name}
                  onClick={() => setTheme(option.name)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${theme === option.name ? 'bg-white dark:bg-slate-900 shadow text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-300/50 dark:hover:bg-slate-600/50'}`}
                  aria-label={`Set theme to ${option.name}`}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>
        );
      };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            <Header onLogout={onLogout} currentUser={currentUser} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
                        <Settings className="w-8 h-8 mr-3 text-indigo-500"/>
                        Cài đặt
                    </h1>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
                        <div className="space-y-6">
                            <ThemeToggle />
                            {/* Các cài đặt khác có thể được thêm vào đây trong tương lai */}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SettingsPage;