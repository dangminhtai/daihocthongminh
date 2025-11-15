
import React, { useState, useEffect, useCallback } from 'react';
import BackButton from './common/BackButton';
import { Building2, LocateFixed, Loader2, AlertCircle, MapPin, ThumbsUp, ThumbsDown, GraduationCap, School as SchoolIcon } from 'lucide-react';
import { School } from '../class/types';
import { findNearbySchools } from '../services/geminiService';
import { UI_MESSAGES } from '../config/ui';

interface UniversityExplorerProps {
    onBack: () => void;
}

type SchoolType = 'university' | 'high_school' | 'middle_school';
type PermissionStatus = 'prompt' | 'granted' | 'denied';

const UniversityExplorer: React.FC<UniversityExplorerProps> = ({ onBack }) => {
    const [schoolType, setSchoolType] = useState<SchoolType>('university');
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');

    useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            setPermissionStatus(result.state as PermissionStatus);
            result.onchange = () => setPermissionStatus(result.state as PermissionStatus);
        });
    }, []);

    const handleFindSchools = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setSchools([]);

        if (!location) {
            if (permissionStatus === 'denied') {
                setError(UI_MESSAGES.UNIVERSITY_EXPLORER.LOCATION_DENIED);
                setIsLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    findNearbySchools(schoolType, { latitude, longitude })
                        .then(setSchools)
                        .catch(err => setError(err.message))
                        .finally(() => setIsLoading(false));
                },
                (err) => {
                    setError(`Lỗi lấy vị trí: ${err.message}`);
                    setIsLoading(false);
                }
            );
        } else {
            findNearbySchools(schoolType, location)
                .then(setSchools)
                .catch(err => setError(err.message))
                .finally(() => setIsLoading(false));
        }
    }, [schoolType, location, permissionStatus]);

    const schoolTypes: { key: SchoolType, label: string, icon: React.ReactNode }[] = [
        { key: 'university', label: UI_MESSAGES.UNIVERSITY_EXPLORER.SCHOOL_TYPE_UNIVERSITY, icon: <GraduationCap className="w-5 h-5" /> },
        { key: 'high_school', label: UI_MESSAGES.UNIVERSITY_EXPLORER.SCHOOL_TYPE_HIGH_SCHOOL, icon: <SchoolIcon className="w-5 h-5" /> },
        { key: 'middle_school', label: UI_MESSAGES.UNIVERSITY_EXPLORER.SCHOOL_TYPE_MIDDLE_SCHOOL, icon: <SchoolIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <BackButton onClick={onBack} />
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{UI_MESSAGES.UNIVERSITY_EXPLORER.TITLE}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{UI_MESSAGES.UNIVERSITY_EXPLORER.DESCRIPTION}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        {schoolTypes.map(type => (
                            <button
                                key={type.key}
                                onClick={() => setSchoolType(type.key)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${schoolType === type.key ? 'bg-white dark:bg-slate-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                {type.icon}
                                {type.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleFindSchools}
                        disabled={isLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <LocateFixed className="w-5 h-5" />}
                        {UI_MESSAGES.UNIVERSITY_EXPLORER.FIND_BUTTON}
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>}

            <div className="space-y-6 mt-8">
                {schools.map((school, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">{school.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{school.address}</span>
                                </p>
                            </div>
                            <a href={school.uri} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-sm flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/80 transition">
                                {UI_MESSAGES.UNIVERSITY_EXPLORER.VIEW_ON_MAP}
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t dark:border-slate-700">
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                                    <ThumbsUp className="w-4 h-4" /> {UI_MESSAGES.UNIVERSITY_EXPLORER.STRENGTHS}
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                                    {school.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
                                    <ThumbsDown className="w-4 h-4" /> {UI_MESSAGES.UNIVERSITY_EXPLORER.WEAKNESSES}
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                                    {school.weaknesses.length > 0 ? school.weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>Không có thông tin.</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UniversityExplorer;