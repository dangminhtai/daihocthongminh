import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { protect } from '../middleware/auth.middleware';
import { User } from '../models/user.model';

const router = express.Router();

// --- Cấu hình Multer để lưu file vào memory ---
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        cb(new Error('Chỉ cho phép tải lên file ảnh (jpeg, jpg, png, gif, webp)!'));
    }
});

// Endpoint: PUT /api/users/profile - Cập nhật thông tin người dùng
router.put('/profile', protect, async (req, res) => {
    try {
        const { fullName, mssv, department, class: className, dateOfBirth, phoneNumber, bio } = req.body;
        const user = await User.findById(req.user!._id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Cập nhật các trường nếu chúng tồn tại trong body
        user.fullName = fullName ?? user.fullName;
        user.mssv = mssv ?? user.mssv;
        user.department = department ?? user.department;
        user.class = className ?? user.class;
        user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth;
        user.phoneNumber = phoneNumber ?? user.phoneNumber;
        user.bio = bio ?? user.bio;

        const updatedUser = await user.save();

        // Trả về đối tượng user đã được cập nhật, bao gồm tất cả các trường
        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            mssv: updatedUser.mssv,
            userId: updatedUser.userId,
            avatarUrl: updatedUser.avatarUrl,
            department: updatedUser.department,
            class: updatedUser.class,
            dateOfBirth: updatedUser.dateOfBirth,
            phoneNumber: updatedUser.phoneNumber,
            bio: updatedUser.bio,
        });

    } catch (error) {
        console.error('Lỗi cập nhật hồ sơ:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Endpoint: POST /api/users/avatar - Cập nhật avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn một file ảnh' });
        }

        const user = await User.findById(req.user!._id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Dùng sharp để xử lý ảnh từ buffer
        const buffer = await sharp(req.file.buffer)
            .resize(200, 200) // Resize ảnh về 200x200
            .png({ quality: 90 }) // Chuyển sang PNG và nén
            .toBuffer();

        // Chuyển buffer thành Base64 Data URI
        user.avatarUrl = `data:image/png;base64,${buffer.toString('base64')}`;

        const updatedUser = await user.save();

        // Trả về thông tin user đã cập nhật đầy đủ
        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            mssv: updatedUser.mssv,
            userId: updatedUser.userId,
            avatarUrl: updatedUser.avatarUrl,
            department: updatedUser.department,
            class: updatedUser.class,
            dateOfBirth: updatedUser.dateOfBirth,
            phoneNumber: updatedUser.phoneNumber,
            bio: updatedUser.bio,
        });

    } catch (error: any) {
        console.error('Lỗi cập nhật avatar:', error);
        if (error.message.includes('file ảnh')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Lỗi server khi xử lý ảnh' });
    }
});


export default router;