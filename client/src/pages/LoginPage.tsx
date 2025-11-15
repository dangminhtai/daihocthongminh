// LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/common/Input';
import SocialButton from '../components/common/SocialButton';
import { UserIcon, LockIcon, FacebookIcon, TwitterIcon, GoogleIcon } from '../components/icons';

interface LoginPageProps {
    onLoginSuccess: () => void; // giữ callback cập nhật isLoggedIn
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/auth/login', { // SỬ DỤNG PROXY
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gmail, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                onLoginSuccess();
            }

            // Delay nhỏ cho animation
            await new Promise((res) => setTimeout(res, 150));

            navigate('/home');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
    };

    return (
        <motion.div
            className="bg-white w-full max-w-md p-8 md:p-12 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Login</h2>
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
                    type="password"
                    placeholder="Type your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockIcon className="w-5 h-5" />}
                />
                <div className="text-right">
                    <a href="#" className="text-xs text-gray-500 hover:text-purple-600 transition-colors">
                        Forgot password?
                    </a>
                </div>
                <button
                    type="submit"
                    className="w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-sky-400 to-pink-500 hover:opacity-90 transition-opacity shadow-lg"
                >
                    LOGIN
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>

            <div className="mt-10 text-center">
                <p className="text-sm text-gray-500 mb-4">Or Sign In Using</p>
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
                <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="font-semibold text-purple-600 hover:underline"
                    >
                        SIGN UP
                    </button>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginPage;
