
import React from 'react';
import { motion } from 'framer-motion';
import { AuthIllustration } from '../assets/AuthIllustration';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        className="hidden lg:flex flex-col justify-center items-center"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <AuthIllustration className="w-full max-w-lg" />
                        <h1 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mt-8 text-center">
                            Khám phá Tương lai của bạn với <span className="text-indigo-500">Trí tuệ Nhân tạo</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-md">
                            Nhận những gợi ý được cá nhân hóa về lộ trình học tập và định hướng nghề nghiệp.
                        </p>
                    </motion.div>

                    <div className="flex justify-center items-center">
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
