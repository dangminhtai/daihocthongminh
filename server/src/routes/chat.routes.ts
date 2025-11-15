import express from 'express';
import { protect } from '../middleware/auth.middleware';
import ChatHistory from '../models/chatHistory.model';
import { getChatResponse } from '../services/gemini';

const router = express.Router();

// Gửi tin nhắn mới
router.post('/', protect, async (req, res) => {
    const { channelId, message } = req.body;
    const userId = req.user!._id;

    if (!channelId || !message) {
        return res.status(400).json({ message: 'Thiếu channelId hoặc message' });
    }

    try {
        let chat = await ChatHistory.findOne({ userId, channelId });
        if (!chat) {
            chat = new ChatHistory({ userId, channelId, messages: [] });
        }

        // Lấy lịch sử để làm ngữ cảnh
        const history = chat.messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        const responseText = await getChatResponse(history, message);

        chat.messages.push({ role: 'user', text: message, timestamp: new Date() });
        chat.messages.push({ role: 'model', text: responseText, timestamp: new Date() });

        await chat.save();

        res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        res.status(500).json({ message: 'Lỗi server khi xử lý tin nhắn' });
    }
});

// Lấy lịch sử chat
router.get('/history/:channelId', protect, async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user!._id;

    try {
        const chat = await ChatHistory.findOne({ userId, channelId });
        if (chat) {
            res.status(200).json(chat.messages);
        } else {
            res.status(200).json([]); // Trả về mảng rỗng nếu chưa có lịch sử
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy lịch sử chat' });
    }
});

// Xóa lịch sử chat
router.delete('/history/:channelId', protect, async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user!._id;

    try {
        await ChatHistory.deleteOne({ userId, channelId });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa lịch sử chat' });
    }
});

export default router;
