
import React, { useState, useCallback } from 'react';
import Home from '../components/Home';
import RoadmapSelector from '../components/RoadmapSelector';
import CareerPathfinder from '../components/CareerPathfinder';
import Quiz from '../components/Quiz'; // Import component mới
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
import Footer from '../components/Footer';
import { View, IUser } from '../class/types';

interface HomePageProps {
    onLogout: () => void;
    currentUser: IUser | null;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout, currentUser }) => {
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
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            <Header onLogout={onLogout} currentUser={currentUser} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto">
                    {renderContent()}
                </div>
            </main>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default HomePage;
