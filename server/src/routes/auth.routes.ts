import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Login } from '../models/login.model';
import { User } from '../models/user.model';
import { generateUniqueUserId, generateDefaultAvatar } from '../utils/user.utils';
import { generateOTP, sendPasswordResetEmail } from '../utils/auth.utils';

const router = express.Router();

// Endpoint: POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { fullName, mssv, gmail, password, role } = req.body;

        if (!fullName || !gmail || !password || !role) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
        }
        if (role === 'student' && !mssv) {
            return res.status(400).json({ message: 'Vui lòng cung cấp Mã số sinh viên.' });
        }
        if (!['student', 'high_school_student'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
        }

        const orQuery: any[] = [{ gmail }];
        if (role === 'student' && mssv) {
            orQuery.push({ mssv });
        }
        const existingLogin = await Login.findOne({ $or: orQuery });

        if (existingLogin) {
            const message = existingLogin.gmail === gmail ? 'Gmail đã tồn tại.' : 'MSSV đã tồn tại.';
            return res.status(409).json({ message });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newLogin = new Login({ gmail, mssv: role === 'student' ? mssv : undefined, password: hashedPassword });
        const savedLogin = await newLogin.save();

        const userId = await generateUniqueUserId();
        const avatarUrl = generateDefaultAvatar(fullName);
        const newUser = new User({
            loginID: savedLogin._id,
            fullName,
            mssv: role === 'student' ? mssv : undefined,
            userId,
            avatarUrl,
            role
        });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
    }
});

// Endpoint: POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { gmail, password } = req.body;
        if (!gmail || !password) {
            return res.status(400).json({ message: 'Vui lòng điền gmail và mật khẩu.' });
        }
        const loginInfo = await Login.findOne({ gmail });
        if (!loginInfo) {
            return res.status(401).json({ message: 'Gmail hoặc mật khẩu không đúng.' });
        }
        const isMatch = await bcrypt.compare(password, loginInfo.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Gmail hoặc mật khẩu không đúng.' });
        }
        const user = await User.findOne({ loginID: loginInfo._id });
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy tài khoản người dùng tương ứng.' });
        }
        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            mssv: user.mssv,
            userId: user.userId,
            avatarUrl: user.avatarUrl,
            role: user.role
        };
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
});

// Endpoint: POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { gmail } = req.body;
    try {
        const login = await Login.findOne({ gmail });

        if (login) {
            const otp = generateOTP();
            login.passwordResetToken = otp;
            login.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
            await login.save();

            await sendPasswordResetEmail(login.gmail, otp);
        }

        res.status(200).json({ message: 'Nếu tài khoản của bạn tồn tại trong hệ thống, một email đặt lại mật khẩu đã được gửi.' });
    } catch (error) {
        console.error("Lỗi trong quá trình quên mật khẩu:", error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra phía máy chủ.' });
    }
});

// Endpoint: POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { gmail, otp, newPassword } = req.body;
    try {
        const login = await Login.findOne({
            gmail,
            passwordResetToken: otp,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!login) {
            return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn.' });
        }

        const salt = await bcrypt.genSalt(10);
        login.password = await bcrypt.hash(newPassword, salt);
        login.passwordResetToken = undefined;
        login.passwordResetExpires = undefined;
        await login.save();

        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
});


export default router;