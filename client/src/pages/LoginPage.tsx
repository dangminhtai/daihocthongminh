import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
interface LoginPageProps {
    onLoginSuccess: () => void;
}
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            // Nếu thành công
            onLoginSuccess(); // Báo cho App.tsx biết đã đăng nhập thành công
            navigate('/home'); // Chuyển hướng đến trang chủ

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
    };
    return (
        <div>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit} className="item-form">
                <input
                    type="text"
                    placeholder="Username (admin)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password (password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};
export default LoginPage;