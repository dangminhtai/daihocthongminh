
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Login } from '../models/login.model'; // Import Login model
import { User } from '../models/user.model';   // Import User model
import { generateUniqueUserId, generateDefaultAvatar } from '../utils/user.utils';

const router = express.Router();

// Endpoint: POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { fullName, mssv, gmail, password } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!fullName || !mssv || !gmail || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        // 2. Kiểm tra xem gmail hoặc mssv đã tồn tại chưa
        const existingLogin = await Login.findOne({ $or: [{ gmail }, { mssv }] });
        if (existingLogin) {
            return res.status(409).json({ message: 'Gmail hoặc MSSV đã tồn tại.' });
        }

        // 3. Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo document Login mới
        const newLogin = new Login({
            gmail,
            mssv,
            password: hashedPassword,
        });
        const savedLogin = await newLogin.save();

        // 5. Tạo userId và avatar mặc định
        const userId = await generateUniqueUserId();
        const avatarUrl = generateDefaultAvatar(fullName);

        // 6. Tạo document User mới liên kết với Login
        const newUser = new User({
            loginID: savedLogin._id,
            fullName,
            mssv,
            userId,
            avatarUrl,
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

        // 1. Tìm kiếm login info bằng gmail
        const loginInfo = await Login.findOne({ gmail });
        if (!loginInfo) {
            return res.status(401).json({ message: 'Gmail hoặc mật khẩu không đúng.' });
        }

        // 2. So sánh mật khẩu người dùng nhập với mật khẩu đã băm trong DB
        const isMatch = await bcrypt.compare(password, loginInfo.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Gmail hoặc mật khẩu không đúng.' });
        }

        // 3. Tìm thông tin User tương ứng
        const user = await User.findOne({ loginID: loginInfo._id });
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy tài khoản người dùng tương ứng.' });
        }

        // 4. Tạo JWT payload với _id của User (quan trọng cho middleware `protect`)
        const payload = {
            id: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: '7d', // Kéo dài thời gian hết hạn
        });

        // 5. Tạo đối tượng user để trả về, loại bỏ các trường không cần thiết
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            mssv: user.mssv,
            userId: user.userId,
            avatarUrl: user.avatarUrl,
        };

        // 6. Trả token và thông tin user về cho client
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: userResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
});


// Endpoint GET /api/auth/home không thay đổi
router.get('/home', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Chào mừng đến trang chủ! Đây là nội dung riêng tư.' });
});

export default router;
