import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [mssv, setMssv] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, mssv, gmail, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại');
            }
            // Nếu đăng ký thành công, chuyển hướng đến trang đăng nhập
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
    };

    return (
        <div>
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit} className="item-form">
                <input type="text" placeholder="Họ và Tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <input type="text" placeholder="MSSV" value={mssv} onChange={(e) => setMssv(e.target.value)} required />
                <input type="email" placeholder="Gmail" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
                <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Đăng ký</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
        </div>
    );
};

export default RegisterPage;