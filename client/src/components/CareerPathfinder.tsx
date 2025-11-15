import React, { useState, useCallback } from 'react';
import { SUBJECTS } from '../config/constants';
import { CareerSuggestion } from '../class/types';
import { suggestCareersForSubjects } from '../services/geminiService';
import { ERROR_MESSAGES } from '../config/errors';
import { UI_MESSAGES } from '../config/ui';
import LoadingSpinner from './common/LoadingSpinner';
import BackButton from './common/BackButton';
import { Lightbulb, Briefcase, Plus, X } from 'lucide-react';

interface CareerPathfinderProps {
    onBack: () => void;
}

const CareerPathfinder: React.FC<CareerPathfinderProps> = ({ onBack }) => {
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleAddSubject = useCallback((subjectName: string) => {
        const trimmedValue = subjectName.trim();
        if (trimmedValue && !selectedSubjects.includes(trimmedValue)) {
            setSelectedSubjects((prev) => [...prev, trimmedValue]);
        }
    }, [selectedSubjects]);

    const handleAddFromInput = useCallback(() => {
        handleAddSubject(inputValue);
        setInputValue('');
    }, [inputValue, handleAddSubject]);

    const handleRemoveSubject = (subjectToRemove: string) => {
        setSelectedSubjects((prev) => prev.filter((subject) => subject !== subjectToRemove));
    };

    const handleToggleSuggestedSubject = (subjectName: string) => {
        if (selectedSubjects.includes(subjectName)) {
            handleRemoveSubject(subjectName);
        } else {
            handleAddSubject(subjectName);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddFromInput();
        }
    };

    const handleSubmit = useCallback(async () => {
        if (selectedSubjects.length === 0) {
            setError(ERROR_MESSAGES.NO_SUBJECTS_SELECTED);
            return;
        }
        setIsLoading(true);
        setError(null);
        setIsSubmitted(true);
        try {
            const result = await suggestCareersForSubjects(selectedSubjects);
            setSuggestions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, [selectedSubjects]);

    const reset = () => {
        setIsSubmitted(false);
        setSelectedSubjects([]);
        setSuggestions([]);
        setError(null);
    }

    if (isSubmitted) {
        return (
            <div>
                <BackButton onClick={reset} />
                <h2 className="text-2xl font-bold text-center mb-2">{UI_MESSAGES.CAREER_PATHFINDER.RESULT_TITLE}</h2>
                <p className="text-center text-slate-600 mb-8">
                    {UI_MESSAGES.CAREER_PATHFINDER.SELECTED_SUBJECTS_LABEL} {selectedSubjects.join(', ')}
                </p>

                {isLoading && <LoadingSpinner />}
                {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

                {!isLoading && !error && (
                    <div className="space-y-6">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 transition-transform transform hover:scale-105 duration-300">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                    <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                                    {suggestion.careerName}
                                </h3>
                                <p className="mt-2 text-slate-600">{suggestion.description}</p>
                                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                    <h4 className="font-semibold text-slate-700 flex items-center">
                                        <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                                        {UI_MESSAGES.CAREER_PATHFINDER.SUITABILITY_LABEL}
                                    </h4>
                                    <p className="mt-1 text-slate-600 text-sm">{suggestion.suitability}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <BackButton onClick={onBack} />
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">{UI_MESSAGES.CAREER_PATHFINDER.TITLE}</h2>
                <p className="mt-2 text-slate-600">{UI_MESSAGES.CAREER_PATHFINDER.DESCRIPTION}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tên môn học và nhấn Enter..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleAddFromInput}
                        className="flex-shrink-0 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                        aria-label="Thêm môn học"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-gray-50 rounded-lg border">
                    {selectedSubjects.length === 0 && (
                        <p className="text-sm text-gray-400 p-2">Các môn học bạn thêm sẽ xuất hiện ở đây...</p>
                    )}
                    {selectedSubjects.map((subject, index) => (
                        <span key={index} className="flex items-center gap-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full animate-fade-in">
                            {subject}
                            <button
                                onClick={() => handleRemoveSubject(subject)}
                                className="text-indigo-500 hover:text-indigo-700"
                                aria-label={`Xóa ${subject}`}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Hoặc chọn từ các môn học phổ biến:</h3>
                <div className="flex flex-wrap gap-3">
                    {SUBJECTS.map((subject) => {
                        const isSelected = selectedSubjects.includes(subject.name);
                        return (
                            <button
                                key={subject.id}
                                onClick={() => handleToggleSuggestedSubject(subject.name)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300'
                                    }`}
                            >
                                {subject.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            <div className="mt-10 text-center">
                <button
                    onClick={handleSubmit}
                    disabled={selectedSubjects.length === 0 || isLoading}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {isLoading ? UI_MESSAGES.CAREER_PATHFINDER.BUTTON_LOADING : UI_MESSAGES.CAREER_PATHFINDER.BUTTON_DEFAULT}
                </button>
            </div>
        </div>
    );
};

export default CareerPathfinder;