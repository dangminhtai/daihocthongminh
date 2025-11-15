
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_DATA } from '../config/constants';
import { QuizQuestion, QuizRecommendation } from '../class/types';
import { getQuizRecommendations } from '../services/geminiService';
import { UI_MESSAGES } from '../config/ui';
import BackButton from './common/BackButton';
import LoadingSpinner from './common/LoadingSpinner';
import { Briefcase, BookOpen, BrainCircuit } from 'lucide-react';

interface QuizProps {
    onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onBack }) => {
    const [currentQuestionId, setCurrentQuestionId] = useState('start');
    const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInputValue, setCustomInputValue] = useState('');
    const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentQuestion: QuizQuestion = QUIZ_DATA[currentQuestionId];

    const handleOptionClick = (option: typeof currentQuestion.options[0]) => {
        const newAnswer = { question: currentQuestion.question, answer: option.payload || option.text };

        if (option.requiresInput) {
            setAnswers(prev => [...prev, newAnswer]);
            setShowCustomInput(true);
            return;
        }

        const nextAnswers = [...answers, newAnswer];
        setAnswers(nextAnswers);

        if (option.nextQuestion) {
            setCurrentQuestionId(option.nextQuestion);
        } else {
            handleSubmit(nextAnswers);
        }
    };

    const handleCustomSubmit = () => {
        if (!customInputValue.trim()) return;
        const newAnswer = { question: "Sở thích/Xu hướng khác", answer: customInputValue };
        const nextAnswers = [...answers, newAnswer];
        setAnswers(nextAnswers);
        handleSubmit(nextAnswers);
        setShowCustomInput(false);
    };

    const handleSubmit = useCallback(async (finalAnswers: { question: string; answer: string }[]) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getQuizRecommendations(finalAnswers);
            setRecommendations(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : UI_MESSAGES.COMMON.GENERIC_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetQuiz = () => {
        setCurrentQuestionId('start');
        setAnswers([]);
        setRecommendations([]);
        setError(null);
        setShowCustomInput(false);
        setCustomInputValue('');
    };

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;

        if (recommendations.length > 0) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold text-center mb-2">{UI_MESSAGES.QUIZ.RESULT_TITLE}</h2>
                    <p className="text-center text-slate-600 mb-8">{UI_MESSAGES.QUIZ.RESULT_DESCRIPTION}</p>
                    <div className="space-y-6">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center mb-2">
                                    <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                                    {rec.careerName}
                                </h3>
                                <p className="text-slate-600 text-sm mb-4">{rec.description}</p>
                                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="font-semibold text-slate-700 flex items-center mb-2">
                                        <BrainCircuit className="h-4 w-4 mr-2 text-green-500" />
                                        Lý do phù hợp
                                    </h4>
                                    <p className="text-slate-600 text-sm">{rec.suitability}</p>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-slate-700 flex items-center mb-2">
                                        <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                                        Ngành học gợi ý
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {rec.suggestedMajors.map((major, i) => (
                                            <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{major}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            );
        }

        if (showCustomInput) {
            return (
                <motion.div key="custom-input" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                    <p className="text-lg font-semibold text-center mb-4">Hãy chia sẻ thêm về lựa chọn của bạn:</p>
                    <textarea
                        value={customInputValue}
                        onChange={(e) => setCustomInputValue(e.target.value)}
                        placeholder={UI_MESSAGES.QUIZ.OTHER_PLACEHOLDER}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                    />
                    <div className="mt-6 text-center">
                        <button onClick={handleCustomSubmit} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                            {UI_MESSAGES.QUIZ.BUTTON_SUBMIT}
                        </button>
                    </div>
                </motion.div>
            )
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div key={currentQuestionId} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                    <p className="text-xl md:text-2xl font-semibold text-center text-slate-800 mb-8">{currentQuestion.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className="p-4 bg-white rounded-lg shadow-md text-slate-700 font-medium text-left hover:bg-indigo-50 hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <div>
            <BackButton onClick={recommendations.length > 0 ? resetQuiz : onBack} />
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">{UI_MESSAGES.QUIZ.TITLE}</h2>
                <p className="mt-2 text-slate-600">{UI_MESSAGES.QUIZ.DESCRIPTION}</p>
            </div>
            {renderContent()}
        </div>
    );
};

export default Quiz;
