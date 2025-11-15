
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IUser, IExploration, IQuizResult } from '../class/types'; // Giả sử các type này được export
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Loader2, Map, Compass, Rocket, FileText, ChevronRight } from 'lucide-react';
import { getHistory } from '../services/historyService'; // Service mới

// Định nghĩa kiểu dữ liệu nhận được từ API
type HistoryItem = (IExploration | IQuizResult) & { typeLabel: string; input?: any; recommendations?: any };


const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const currentUser: IUser | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistoryItems(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải lịch sử.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getIconForType = (typeLabel: string) => {
        switch (typeLabel) {
            case 'Khám phá Lộ trình': return <Map className="w-6 h-6 text-blue-500" />;
            case 'Khám phá Môn học': return <Compass className="w-6 h-6 text-green-500" />;
            case 'Trắc nghiệm Hướng nghiệp': return <Rocket className="w-6 h-6 text-purple-500" />;
            default: return <FileText className="w-6 h-6 text-gray-500" />;
        }
    };

    const renderModalContent = () => {
        if (!selectedItem) return null;

        const results = selectedItem.results || selectedItem.recommendations;

        return (
            <div className="p-6">
                <h3 className="font-bold text-lg mb-2 dark:text-slate-100">{selectedItem.typeLabel}</h3>
                <p className="text-sm text-slate-500 mb-4">Ngày: {new Date(selectedItem.createdAt).toLocaleDateString('vi-VN')}</p>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {results.map((item: any, index: number) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{item.majorName || item.careerName}</h4>
                            <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{item.description}</p>
                            {item.suitability && <p className="text-sm mt-2 italic text-slate-500 dark:text-slate-400">"{item.suitability}"</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            <Header onLogout={handleLogout} currentUser={currentUser} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
                        <History className="w-8 h-8 mr-3 text-indigo-500" />
                        Lịch sử khám phá
                    </h1>
                    {isLoading && <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!isLoading && !error && historyItems.length === 0 && (
                        <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                            <History className="w-16 h-16 mx-auto text-indigo-300 dark:text-indigo-600 mb-4" />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Chưa có hoạt động nào</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Lịch sử các lần làm trắc nghiệm và khám phá của bạn sẽ được hiển thị tại đây.
                            </p>
                            <button onClick={() => navigate('/home')} className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                                Bắt đầu khám phá
                            </button>
                        </div>
                    )}
                    {!isLoading && !error && historyItems.length > 0 && (
                        <div className="space-y-4">
                            {historyItems.map((item) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                                    }}
                                    className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm cursor-pointer"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0">{getIconForType(item.typeLabel)}</div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.typeLabel}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-lg font-bold dark:text-white">Chi tiết kết quả</h2>
                                <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X /></button>
                            </div>
                            {renderModalContent()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HistoryPage;
