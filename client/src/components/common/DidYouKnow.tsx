import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { getCareerFact } from '../../services/geminiService';
import { motion } from 'framer-motion';

const DidYouKnow: React.FC = () => {
    const [fact, setFact] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFact = async () => {
            setIsLoading(true);
            const newFact = await getCareerFact();
            setFact(newFact);
            setIsLoading(false);
        };
        fetchFact();
    }, []);

    return (
        <motion.div
            className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div>
                <div className="flex items-center mb-3">
                    <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
                    <h4 className="font-bold text-lg text-yellow-800">Bạn có biết?</h4>
                </div>
                <div className="text-slate-700 min-h-[60px]">
                    {isLoading ? (
                        <div className="space-y-2">
                            <div className="h-4 bg-yellow-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-yellow-200 rounded w-5/6 animate-pulse"></div>
                        </div>
                    ) : (
                        <p className="text-sm">"{fact}"</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DidYouKnow;
