import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/common/Input';
import SocialButton from '../components/common/SocialButton';
import { UserIcon, LockIcon, FacebookIcon, TwitterIcon, GoogleIcon } from '../components/icons';
import { IUser } from '../class/types';
import { Eye, EyeOff } from 'lucide-react';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

interface LoginPageProps {
    onLoginSuccess: (user: IUser) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gmail, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                onLoginSuccess(data.user);
            } else {
                throw new Error('Phản hồi không hợp lệ từ máy chủ');
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.div
                className="bg-white dark:bg-slate-800 w-full max-w-md p-8 md:p-12 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <Input
                        id="gmail"
                        label="Email"
                        type="email"
                        placeholder="Type your email"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        icon={<UserIcon className="w-5 h-5" />}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Type your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<LockIcon className="w-5 h-5" />}
                        suffixIcon={
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        }
                    />
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() => setIsForgotModalOpen(true)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-sky-400 to-pink-500 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'LOGIN'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </form>

                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Or Sign In Using</p>
                    <div className="flex justify-center space-x-4">
                        <SocialButton bgColor="bg-blue-600" aria-label="Sign in with Facebook">
                            <FacebookIcon className="w-5 h-5" />
                        </SocialButton>
                        <SocialButton bgColor="bg-sky-500" aria-label="Sign in with Twitter">
                            <TwitterIcon className="w-5 h-5" />
                        </SocialButton>
                        <SocialButton bgColor="bg-white" aria-label="Sign in with Google">
                            <GoogleIcon className="w-6 h-6" />
                        </SocialButton>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-semibold text-purple-600 hover:underline dark:text-purple-400"
                        >
                            SIGN UP
                        </button>
                    </p>
                </div>
            </motion.div>

            <ForgotPasswordModal
                isOpen={isForgotModalOpen}
                onClose={() => setIsForgotModalOpen(false)}
            />
        </>
    );
};

export default LoginPage;