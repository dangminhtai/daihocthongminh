
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IUser } from '../class/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Code, LifeBuoy } from 'lucide-react';

const placeholderUser: IUser = {
    _id: 'placeholder',
    fullName: 'Placeholder User',
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
                            Tài liệu & Hướng dẫn
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Tìm hiểu cách tận dụng tối đa các công cụ AI của chúng tôi.
                        </p>
                    </div>

                    <div className="space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                        <section>
                            <h2 className="text-2xl font-bold flex items-center text-slate-800 dark:text-slate-200 mb-4">
                                <Book className="w-6 h-6 mr-3 text-indigo-500" />
                                Bắt đầu
                            </h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                Chào mừng bạn đến với Đại học Thông minh! Nền tảng của chúng tôi được thiết kế để cung cấp cho bạn những gợi ý được cá nhân hóa về con đường học tập và sự nghiệp bằng cách sử dụng trí tuệ nhân tạo tiên tiến. Bắt đầu bằng cách khám phá các tính năng trên trang chủ: làm một bài trắc nghiệm nhanh, khám phá các lộ trình học tập, hoặc tìm kiếm nghề nghiệp dựa trên các môn học yêu thích của bạn.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold flex items-center text-slate-800 dark:text-slate-200 mb-4">
                                <Code className="w-6 h-6 mr-3 text-green-500" />
                                Tích hợp API (Ví dụ)
                            </h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                Đối với các nhà phát triển, chúng tôi cung cấp một API mạnh mẽ để tích hợp các dịch vụ gợi ý của chúng tôi vào ứng dụng của bạn. Dưới đây là một ví dụ về cách gọi API để nhận gợi ý chuyên ngành.
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm text-slate-800 dark:text-slate-200"><code>
                                    {`
fetch('https://api.daihocthongminh.vn/v1/suggestions/majors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    roadmap: 'Công nghệ & Kỹ thuật'
  })
})
.then(response => response.json())
.then(data => console.log(data));
`}
                                </code></pre>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold flex items-center text-slate-800 dark:text-slate-200 mb-4">
                                <LifeBuoy className="w-6 h-6 mr-3 text-red-500" />
                                Hỗ trợ
                            </h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                Nếu bạn gặp bất kỳ vấn đề nào hoặc có câu hỏi, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi tại <a href="mailto:support@daihocthongminh.vn" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@daihocthongminh.vn</a>. Chúng tôi luôn sẵn lòng giúp đỡ!
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
