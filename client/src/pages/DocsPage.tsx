import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IUser } from '../class/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Shield, LifeBuoy } from 'lucide-react';

const placeholderUser: IUser = {
    _id: 'placeholder',
    fullName: 'Sinh viên UTE',
    userId: '000000',
    avatarUrl: '',
};

const DocsPage: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || JSON.stringify(placeholderUser));
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            <Header onLogout={handleLogout} currentUser={currentUser} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
                            Chính sách & Quy định
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Đọc kỹ các chính sách để đảm bảo trải nghiệm một cách tốt nhất.
                        </p>
                    </div>

                    <div className="space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                        <section>
                            <h2 className="text-2xl font-bold flex items-center text-slate-800 dark:text-slate-200 mb-4">
                                <Shield className="w-6 h-6 mr-3 text-green-500" />
                                Chính sách quyền riêng tư
                            </h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                Chúng tôi cam kết bảo vệ thông tin cá nhân của sinh viên. Dữ liệu sẽ chỉ được sử dụng để nâng cao trải nghiệm học tập và không chia sẻ với bên thứ ba nếu không được phép.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold flex items-center text-slate-800 dark:text-slate-200 mb-4">
                                <Book className="w-6 h-6 mr-3 text-indigo-500" />
                                Quy định sử dụng nền tảng
                            </h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                Sinh viên được phép truy cập, sử dụng tài nguyên học tập và gợi ý nghề nghiệp. Mọi hành vi phá hoại đều sẽ bị chặn.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold flex items-center text-slate-800 dark:text-slate-200 mb-4">
                                <LifeBuoy className="w-6 h-6 mr-3 text-red-500" />
                                Hỗ trợ & Liên hệ
                            </h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                Mọi thắc mắc về chính sách hoặc vấn đề kỹ thuật, sinh viên có thể liên hệ với bộ phận hỗ trợ qua email <a href="https://google.com" target='blank' className="text-indigo-600 dark:text-indigo-400 hover:underline">support@UTEOrie.vn</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default DocsPage;
