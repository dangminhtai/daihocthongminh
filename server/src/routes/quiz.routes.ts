import express from 'express';
import { protect } from '../middleware/auth.middleware';
import QuizResult from '../models/quizResult.model';
import {
    generateNextQuizQuestion as generateNextQuestionFromAI,
    getQuizRecommendations as getRecommendationsFromAI
} from '../services/gemini';

const router = express.Router();

// Tạo câu hỏi tiếp theo
router.post('/next-question', protect, async (req, res) => {
    const { history } = req.body;
    if (!Array.isArray(history)) {
        return res.status(400).json({ message: 'Lịch sử phải là một mảng' });
    }

    try {
        const nextStep = await generateNextQuestionFromAI(history);
        res.status(200).json(nextStep);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server khi tạo câu hỏi" });
    }
});

// Lấy kết quả cuối cùng
router.post('/recommendations', protect, async (req, res) => {
    const { history } = req.body;
    if (!Array.isArray(history) || history.length === 0) {
        return res.status(400).json({ message: 'Lịch sử trả lời không được rỗng' });
    }
    try {
        const recommendations = await getRecommendationsFromAI(history);

        const newQuizResult = new QuizResult({
            userId: req.user!._id,
            history,
            recommendations,
        });
        await newQuizResult.save();

        res.status(200).json(recommendations);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server khi lấy kết quả" });
    }
});

export default router;
