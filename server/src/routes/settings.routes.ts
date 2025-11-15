
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { Settings } from '../models/settings.model';

const router = express.Router();

// Endpoint: GET /api/settings - Lấy cài đặt của người dùng hiện tại
router.get('/', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne({ userId: req.user!._id });

        if (!settings) {
            // Nếu người dùng chưa có cài đặt, tạo một cái mặc định
            settings = await Settings.create({ userId: req.user!._id, theme: 'system' });
        }

        res.json(settings);
    } catch (error) {
        console.error('Lỗi khi lấy cài đặt:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy cài đặt.' });
    }
});

// Endpoint: PUT /api/settings - Cập nhật cài đặt của người dùng
router.put('/', protect, async (req, res) => {
    const { theme } = req.body;

    if (!theme || !['light', 'dark', 'system'].includes(theme)) {
        return res.status(400).json({ message: 'Giá trị theme không hợp lệ.' });
    }

    try {
        const updatedSettings = await Settings.findOneAndUpdate(
            { userId: req.user!._id },
            { theme },
            { new: true, upsert: true } // Tạo mới nếu chưa tồn tại
        );

        res.json(updatedSettings);
    } catch (error) {
        console.error('Lỗi khi cập nhật cài đặt:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật cài đặt.' });
    }
});

export default router;
