
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CVTemplate } from '../../class/types';
import { getCVTemplates, rateCVTemplate } from '../../services/cvService';
import { X, Star, Users, ThumbsUp, Clock, Loader2 } from 'lucide-react';

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (template: CVTemplate) => void;
}

type SortByType = 'popularity' | 'rating' | 'newest';

const StarRating: React.FC<{ rating: number; onRate?: (newRating: number) => void; ratingCount: number }> = ({ rating, onRate, ratingCount }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex items-center" onMouseLeave={() => setHoverRating(0)} title={`${rating.toFixed(1)} sao từ ${ratingCount} lượt đánh giá`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={`cursor-pointer transition-colors ${(hoverRating >= star || rating >= star)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRate?.(star);
                    }}
                    onMouseEnter={() => onRate && setHoverRating(star)}
                />
            ))}
        </div>
    );
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose, onSelectTemplate }) => {
    const [templates, setTemplates] = useState<CVTemplate[]>([]);
    const [sortBy, setSortBy] = useState<SortByType>('popularity');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            getCVTemplates(sortBy)
                .then(setTemplates)
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, sortBy]);

    const handleRate = async (templateId: string, rating: number) => {
        // Optimistic UI update
        const originalTemplates = templates;
        const newTemplates = templates.map(t => {
            if (t._id === templateId) {
                // This is a rough estimation, backend will return the correct value
                const newRatingCount = t.ratingCount + 1;
                const newAverage = ((t.averageRating * t.ratingCount) + rating) / newRatingCount;
                return { ...t, averageRating: newAverage, ratingCount: newRatingCount };
            }
            return t;
        });
        setTemplates(newTemplates);

        try {
            const updatedTemplate = await rateCVTemplate(templateId, rating);
            // Update with the correct value from server
            setTemplates(templates.map(t => t._id === templateId ? updatedTemplate : t));
        } catch (error) {
            console.error("Lỗi khi đánh giá mẫu:", error);
            // Revert on error
            setTemplates(originalTemplates);
        }
    };

    const sortOptions: { key: SortByType, label: string, icon: React.ReactNode }[] = [
        { key: 'popularity', label: 'Phổ biến', icon: <Users size={16} /> },
        { key: 'rating', label: 'Đánh giá cao', icon: <ThumbsUp size={16} /> },
        { key: 'newest', label: 'Mới nhất', icon: <Clock size={16} /> },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-xl font-bold dark:text-white">Duyệt Mẫu CV Cộng đồng</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X /></button>
                        </div>

                        <div className="p-4 border-b dark:border-slate-700 flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium dark:text-slate-300">Sắp xếp theo:</span>
                                {sortOptions.map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setSortBy(opt.key)}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-colors ${sortBy === opt.key ? 'bg-indigo-600 text-white font-semibold' : 'bg-gray-200 dark:bg-slate-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin w-8 h-8 text-indigo-500" /></div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {templates.map(template => (
                                        <motion.div
                                            key={template._id}
                                            onClick={() => onSelectTemplate(template)}
                                            className="cursor-pointer group flex flex-col"
                                            whileHover={{ y: -5 }}
                                        >
                                            <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-indigo-500 transition-all duration-200 shadow-md">
                                                <img
                                                    src={template.thumbnailUrl || `https://api.dicebear.com/8.x/shapes/svg?seed=${template.name}`}
                                                    alt={template.name}
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <h3 className="font-bold text-sm truncate dark:text-slate-100">{template.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    bởi {typeof template.createdBy === 'object' ? template.createdBy.fullName : 'Hệ thống'}
                                                </p>
                                                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-1"><Users size={12} /> {template.usageCount}</div>
                                                    <div className="flex items-center gap-1">
                                                        <StarRating rating={template.averageRating} onRate={(r) => handleRate(template._id, r)} ratingCount={template.ratingCount} />
                                                        ({template.ratingCount})
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TemplateSelector;
