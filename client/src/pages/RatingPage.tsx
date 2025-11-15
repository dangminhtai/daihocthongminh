
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IUser } from '../class/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Send, Users } from 'lucide-react';
import { getRatingStats, submitRating } from '../services/ratingService';

const placeholderUser: IUser = {
    _id: 'placeholder',
    fullName: 'Placeholder User',
    userId: '000000',
    avatarUrl: '',
};

interface RatingStats {
    count: number;
    average: number;
}

const RatingPage: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || JSON.stringify(placeholderUser));
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<RatingStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getRatingStats();
                setStats(data);
            } catch (error) {
                console.error("Không thể tải thống kê rating:", error);
            }
        };
        fetchStats();
    }, [isSubmitted]); // Refetch stats after submission

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await submitRating(rating, feedback);
            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderAverageStars = (average: number) => {
        const fullStars = Math.floor(average);
        const halfStar = average - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className="flex justify-center items-center">
                {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />)}
                {halfStar && <Star key="half" className="w-5 h-5 text-yellow-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />}
                {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 dark:text-gray-600" />)}
                <span className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300">{average.toFixed(1)}/5.0</span>
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            <Header onLogout={handleLogout} currentUser={currentUser} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 md:p-12 text-center">
                        {isSubmitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Cảm ơn bạn!</h1>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Chúng tôi đã nhận được phản hồi của bạn. Sự đóng góp của bạn giúp chúng tôi cải thiện ứng dụng tốt hơn.
                                </p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="mt-8 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                                >
                                    Quay về Trang chủ
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
                                    Đánh giá & Phản hồi
                                </h1>
                                <p className="text-slate-600 dark:text-slate-300 mb-8">
                                    Trải nghiệm của bạn quan trọng với chúng tôi. Vui lòng cho chúng tôi biết suy nghĩ của bạn.
                                </p>

                                {stats && (
                                    <div className="mb-8 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                        <div className="flex items-center justify-center space-x-2 text-slate-800 dark:text-slate-200 font-semibold">
                                            <Users className="w-5 h-5 text-green-500" />
                                            <span>Được tin tưởng bởi <span className="font-bold text-green-500">{(100000 + stats.count).toLocaleString('vi-VN')}</span> người dùng</span>
                                        </div>
                                        <div className="mt-2">
                                            {renderAverageStars(stats.average)}
                                        </div>
                                    </div>
                                )}


                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div>
                                        <label className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 block">
                                            Bạn đánh giá ứng dụng này thế nào?
                                        </label>
                                        <div className="flex justify-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <motion.div key={star} whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                                                    <Star
                                                        className={`w-10 h-10 cursor-pointer transition-colors ${(hoverRating >= star || rating >= star)
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300 dark:text-gray-600'
                                                            }`}
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="feedback" className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 block">
                                            Bạn có góp ý gì thêm không?
                                        </label>
                                        <textarea
                                            id="feedback"
                                            rows={4}
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            placeholder="Hãy cho chúng tôi biết thêm..."
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={rating === 0 || isLoading}
                                        className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Send className="w-5 h-5" />}
                                        {isLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default RatingPage;
