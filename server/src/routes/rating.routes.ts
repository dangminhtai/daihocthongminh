
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { Rating } from '../models/rating.model';

const router = express.Router();

// Endpoint: POST /api/ratings - Gửi hoặc cập nhật một đánh giá
router.post('/', protect, async (req, res) => {
    const { rating, feedback } = req.body;
    const userId = req.user!._id;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating phải là một số từ 1 đến 5.' });
    }

    try {
        // Tìm và cập nhật nếu đã tồn tại, hoặc tạo mới nếu chưa có (upsert)
        const newRating = await Rating.findOneAndUpdate(
            { userId },
            { rating, feedback },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json({ message: 'Cảm ơn bạn đã gửi đánh giá!', rating: newRating });
    } catch (error) {
        console.error('Lỗi khi lưu đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server khi lưu đánh giá.' });
    }
});

// Endpoint: GET /api/ratings/stats - Lấy thống kê về rating
router.get('/stats', async (req, res) => {
    try {
        const stats = await Rating.aggregate([
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    average: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length > 0) {
            res.json({
                count: stats[0].count,
                average: stats[0].average
            });
        } else {
            // Nếu chưa có rating nào
            res.json({ count: 0, average: 0 });
        }
    } catch (error) {
        console.error('Lỗi khi lấy thống kê rating:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thống kê.' });
    }
});


export default router;
