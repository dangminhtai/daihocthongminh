
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import Exploration, { IExploration } from '../models/exploration.model';
import QuizResult, { IQuizResult } from '../models/quizResult.model';
import { EXPLORATION_TYPES } from '../models/constants';

const router = express.Router();

// Định nghĩa kiểu dữ liệu trả về để nhất quán
type HistoryItem = (
    (IExploration & { typeLabel: 'Khám phá Lộ trình' | 'Khám phá Môn học' }) |
    (IQuizResult & { typeLabel: 'Trắc nghiệm Hướng nghiệp' })
);

// GET /api/history - Lấy toàn bộ lịch sử khám phá và trắc nghiệm của người dùng
router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user!._id;

        const explorations = await Exploration.find({ userId }).sort({ createdAt: -1 }).lean();
        const quizResults = await QuizResult.find({ userId }).sort({ createdAt: -1 }).lean();

        const mappedExplorations = explorations.map(e => ({
            ...e,
            typeLabel: e.type === EXPLORATION_TYPES.ROADMAP ? 'Khám phá Lộ trình' : 'Khám phá Môn học'
        }));

        const mappedQuizzes = quizResults.map(q => ({
            ...q,
            typeLabel: 'Trắc nghiệm Hướng nghiệp'
        }));

        const combinedHistory: any[] = [...mappedExplorations, ...mappedQuizzes];

        // Sắp xếp lại lần cuối để đảm bảo thứ tự đúng
        combinedHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json(combinedHistory);

    } catch (error) {
        console.error('Lỗi khi lấy lịch sử:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy lịch sử hoạt động.' });
    }
});

export default router;