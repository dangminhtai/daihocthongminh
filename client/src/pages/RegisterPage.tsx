
// RegisterPage.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import { UserIcon, LockIcon, IdCardIcon, EnvelopeIcon } from '../components/icons';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [gmail, setGmail] = useState('');
    const [mssv, setMssv] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/auth/register', { // SỬ DỤNG PROXY
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, mssv, gmail, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại');
            }

            setSuccess('Đăng ký thành công! Chuyển sang đăng nhập...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 w-full max-w-md p-8 md:p-12 rounded-2xl shadow-2xl">
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
                    type="password"
                    placeholder="Type your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockIcon className="w-5 h-5" />}
                />
                <button
                    type="submit"
                    className="w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-sky-400 to-pink-500 hover:opacity-90 transition-opacity shadow-lg"
                >
                    SIGN UP
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
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
        </div>
    );
};

export default RegisterPage;
