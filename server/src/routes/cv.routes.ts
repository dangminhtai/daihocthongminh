
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { CV } from '../models/cv.model';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { generateCVSummary, enhanceJobDescription, rewriteCV } from '../services/gemini';

const router = express.Router();

// GET /api/cv - Get user's CV data
router.get('/', protect, async (req, res) => {
    try {
        let cv = await CV.findOne({ userId: req.user!._id });
        if (!cv) {
            // If no CV, create a default one from user profile
            const user = await User.findById(req.user!._id);
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
            }
            const loginInfo = await Login.findById(user.loginID);
            if (!loginInfo) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin đăng nhập.' });
            }

            cv = new CV({
                userId: req.user!._id,
                template: 'classic',
                personalDetails: {
                    fullName: user.fullName,
                    jobTitle: 'Sinh viên',
                    email: loginInfo.gmail,
                    phoneNumber: user.phoneNumber || '',
                    address: '',
                    avatarUrl: user.avatarUrl,
                },
                summary: '',
                education: [],
                experience: [],
                skills: [],
                projects: [],
            });
            await cv.save();
        }
        res.json(cv);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu CV:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// POST /api/cv - Save/Update user's CV data
router.post('/', protect, async (req, res) => {
    try {
        const cvData = req.body;
        // Ensure avatarUrl is up-to-date with user profile
        const user = await User.findById(req.user!._id);
        if (user) {
            cvData.personalDetails.avatarUrl = user.avatarUrl;
        }

        const cv = await CV.findOneAndUpdate(
            { userId: req.user!._id },
            cvData,
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json(cv);
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu CV:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// POST /api/cv/generate-summary - AI generate summary
router.post('/generate-summary', protect, async (req, res) => {
    try {
        const cvData = req.body;
        const summary = await generateCVSummary(cvData);
        res.json({ summary });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
});

// POST /api/cv/enhance-description - AI enhance description
router.post('/enhance-description', protect, async (req, res) => {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: 'Thiếu mô tả' });

    try {
        const enhancedDescription = await enhanceJobDescription(description);
        res.json({ enhancedDescription });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
});

// POST /api/cv/rewrite - AI rewrite the whole CV
router.post('/rewrite', protect, async (req, res) => {
    try {
        const cvData = req.body;
        if (!cvData) {
            return res.status(400).json({ message: 'Thiếu dữ liệu CV.' });
        }
        const rewrittenCV = await rewriteCV(cvData);
        // Đảm bảo userId và các dữ liệu nhạy cảm không bị mất hoặc ghi đè
        const user = req.user as { _id: any };
        rewrittenCV.userId = user._id.toString();

        res.json(rewrittenCV);
    } catch (error: any) {
        console.error('Lỗi khi viết lại CV:', error);
        res.status(500).json({ message: error.message || "Lỗi server khi viết lại CV" });
    }
});

export default router;