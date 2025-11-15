import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, CheckCircle } from 'lucide-react';
import { forgotPassword, resetPassword } from '../../services/authService';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'request' | 'reset' | 'success';

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<Step>('request');
    const [gmail, setGmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleClose = () => {
        onClose();
        // Reset state after modal closes
        setTimeout(() => {
            setStep('request');
            setGmail('');
            setOtp('');
            setNewPassword('');
            setError(null);
            setMessage(null);
        }, 300);
    };

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            const data = await forgotPassword(gmail);
            setMessage(data.message + " Vui lòng kiểm tra hộp thư email của bạn.");
            setStep('reset');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            const data = await resetPassword(gmail, otp, newPassword);
            setMessage(data.message);
            setStep('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'request':
                return (
                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Khôi phục mật khẩu</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nhập email của bạn để nhận mã OTP.</p>
                        <input type="email" value={gmail} onChange={(e) => setGmail(e.target.value)} placeholder="Email" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </form>
                );
            case 'reset':
                return (
                    <form onSubmit={handleResetSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Đặt lại mật khẩu</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nhập mã OTP và mật khẩu mới của bạn.</p>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Mã OTP" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>
                );
            case 'success':
                return (
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thành công!</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{message}</p>
                        <button onClick={handleClose} className="mt-6 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
                            Đóng
                        </button>
                    </div>
                );
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                            {message && step !== 'success' && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
                            {renderStep()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ForgotPasswordModal;