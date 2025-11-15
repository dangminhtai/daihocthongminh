
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/common/Input';
import { UserIcon, LockIcon, IdCardIcon, EnvelopeIcon } from '../components/icons';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [gmail, setGmail] = useState('');
    const [mssv, setMssv] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, mssv, gmail, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại');
            }

            setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="bg-white dark:bg-slate-800 w-full max-w-md p-8 md:p-12 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="fullName"
                    label="Full Name"
                    type="text"
                    placeholder="Type your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    icon={<UserIcon className="w-5 h-5" />}
                />
                <Input
                    id="gmail"
                    label="Email"
                    type="email"
                    placeholder="Type your email"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    icon={<EnvelopeIcon className="w-5 h-5" />}
                />
                <Input
                    id="mssv"
                    label="Student ID"
                    type="text"
                    placeholder="Type your student ID"
                    value={mssv}
                    onChange={(e) => setMssv(e.target.value)}
                    icon={<IdCardIcon className="w-5 h-5" />}
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
                <button
                    type="submit"
                    disabled={isLoading || !!success}
                    className="w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-sky-400 to-pink-500 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'SIGN UP'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2 text-center">{success}</p>}
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="font-semibold text-purple-600 hover:underline dark:text-purple-400"
                    >
                        LOGIN
                    </button>
                </p>
            </div>
        </motion.div>
    );
};

export default RegisterPage;
