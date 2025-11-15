
import React, { useState, useCallback } from 'react';
import Home from '../components/Home';
import RoadmapSelector from '../components/RoadmapSelector';
import CareerPathfinder from '../components/CareerPathfinder';
import Quiz from '../components/Quiz'; // Import component mới
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
import { View } from '../class/types';
import { UI_MESSAGES } from '../config/ui';

interface HomePageProps {
    onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
    const [currentView, setCurrentView] = useState<{ view: View; payload?: any }>({ view: 'home' });

    const navigateTo = useCallback((view: View, payload?: any) => {
        setCurrentView({ view, payload });
    }, []);

    const renderContent = () => {
        switch (currentView.view) {
            case 'roadmap':
                return <RoadmapSelector
                    onBack={() => navigateTo('home')}
                    preselectedRoadmapId={currentView.payload}
                />;
            case 'careerPath':
                return <CareerPathfinder onBack={() => navigateTo('home')} />;
            case 'quiz': // Thêm case cho quiz
                return <Quiz onBack={() => navigateTo('home')} />;
            case 'home':
            default:
                return <Home onNavigate={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header onLogout={onLogout} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto">
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
