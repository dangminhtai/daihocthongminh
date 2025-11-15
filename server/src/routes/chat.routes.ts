import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/auth.middleware';
import ChatHistory from '../models/chatHistory.model';
import { getChatResponse } from '../services/chatAi.service';

const router = express.Router();

// --- Cấu hình Multer cho việc tải lên file chat ---
const uploadDir = path.join(__dirname, '../../../public/uploads/chat');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Sử dụng timestamp để đảm bảo tên file là duy nhất và xử lý ký tự UTF-8
        cb(null, `${Date.now()}-${Buffer.from(file.originalname, 'latin1').toString('utf8')}`);
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 25 * 1024 * 1024 } }); // Giới hạn 25MB

// Gửi tin nhắn mới (có thể kèm file)
router.post('/', protect, upload.single('file'), async (req, res) => {
    const { channelId, message, useGoogleSearch } = req.body;
    const userId = req.user!._id;

    const userMessageParts = [];
    if (message && message !== 'undefined') {
        userMessageParts.push({ text: message });
    }
    if (req.file) {
        userMessageParts.push({
            fileData: {
                mimeType: req.file.mimetype,
                fileUri: `/uploads/chat/${req.file.filename}` // Đường dẫn công khai để client truy cập
            }
        });
    }

    if (userMessageParts.length === 0) {
        return res.status(400).json({ message: 'Tin nhắn không được rỗng.' });
    }

    try {
        let chat = await ChatHistory.findOne({ userId, channelId });
        if (!chat) {
            chat = new ChatHistory({ userId, channelId, turns: [] });
        }
        
        const history = chat.turns;

        const responseText = await getChatResponse(history, userMessageParts, useGoogleSearch === 'true');

        const newTurn = {
            user: { parts: userMessageParts },
            model: { parts: [{ text: responseText }] },
            createdAt: new Date(),
        };
        chat.turns.push(newTurn);

        await chat.save();
        
        // Trả về phần model của turn mới để client có thể render ngay lập tức
        res.status(200).json({ model: newTurn.model });
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
            res.status(200).json(chat.turns);
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