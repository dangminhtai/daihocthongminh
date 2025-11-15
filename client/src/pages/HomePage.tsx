
import React, { useState, useCallback } from 'react';
import Home from '../components/Home';
import RoadmapSelector from '../components/RoadmapSelector';
import CareerPathfinder from '../components/CareerPathfinder';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
import { View } from '../class/types';
import { UI_MESSAGES } from '../config/ui';

const HomePage: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('home');

    const navigateTo = useCallback((view: View) => {
        setCurrentView(view);
    }, []);

    const renderContent = () => {
        switch (currentView) {
            case 'roadmap':
                return <RoadmapSelector onBack={() => navigateTo('home')} />;
            case 'careerPath':
                return <CareerPathfinder onBack={() => navigateTo('home')} />;
            case 'home':
            default:
                return <Home onNavigate={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {renderContent()}
                </div>
            </main>
            <footer className="text-center py-4 text-sm text-slate-500">
                <p>{UI_MESSAGES.FOOTER.COPYRIGHT}</p>
            </footer>
            <ChatBot />
        </div>
    );
};

export default HomePage;
