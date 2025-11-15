import express, { Request, Response, Router } from 'express';

const router = Router();

// Endpoint: POST /api/auth/login
// Đây là một cách giả lập đăng nhập CỰC KỲ ĐƠN GIẢN.
// Trong thực tế, bạn cần mã hóa mật khẩu và kiểm tra trong database.
router.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password123') {
        // Đăng nhập thành công
        res.status(200).json({ message: 'Đăng nhập thành công!' });
    } else {
        // Sai username hoặc password
        res.status(401).json({ message: 'Username hoặc password không đúng' });
    }
});

// Endpoint: GET /api/auth/home
// Giả lập một endpoint cần "đăng nhập" để truy cập.
router.get('/home', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Chào mừng đến trang chủ! Đây là nội dung riêng tư.' });
});

export default router;