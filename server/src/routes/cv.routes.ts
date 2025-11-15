import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { CV } from '../models/cv.model';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { generateCVSummary, enhanceJobDescription, rewriteCV } from '../services/cvAi.service';
import { CVTemplate } from '../models/cvTemplate.model';

const router = express.Router();

// GET /api/cv - Get user's CV data, populated with template info
router.get('/', protect, async (req, res) => {
    try {
        let cv = await CV.findOne({ userId: req.user!._id }).populate('templateId');
        if (!cv) {
            // If no CV, create a default one
            const user = await User.findById(req.user!._id);
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
            }
            const loginInfo = await Login.findById(user.loginID);
            if (!loginInfo) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin đăng nhập.' });
            }

            // Find the default "Classic" template to assign
            let defaultTemplate = await CVTemplate.findOne({ name: 'Cổ điển', isDefault: true });
            if (!defaultTemplate) {
                // If default template doesn't exist (e.g., first run), create it
                defaultTemplate = new CVTemplate({
                    name: 'Cổ điển',
                    description: 'Một mẫu CV truyền thống, rõ ràng và chuyên nghiệp.',
                    structure: { layout: 'classic', sectionOrder: ['summary', 'experience', 'education', 'projects', 'skills'] },
                    isPublic: true,
                    isDefault: true,
                    createdBy: req.user!._id, // Assign to current user or a system user ID
                });
                await defaultTemplate.save();
            }


            const newCV = new CV({
                userId: req.user!._id,
                templateId: defaultTemplate._id,
                personalDetails: {
                    fullName: user.fullName,
                    jobTitle: 'Sinh viên',
                    email: loginInfo.gmail,
                    phoneNumber: user.phoneNumber || '',
                    address: '',
                    avatarUrl: user.avatarUrl,
                },
                summary: 'Là một sinh viên trẻ đầy nhiệt huyết và tinh thần cầu tiến, tôi mong muốn tìm kiếm cơ hội đầu tiên để tích lũy kinh nghiệm thực tế. Tôi sở hữu khả năng học hỏi nhanh, tinh thần trách nhiệm cao và sẵn sàng đối mặt với thử thách mới. Mục tiêu của tôi là phát triển các kỹ năng chuyên môn vững chắc và đóng góp tích cực vào môi trường làm việc chuyên nghiệp.',
                education: [],
                experience: [],
                skills: [],
                projects: [],
            });
            await newCV.save();
            // Populate the templateId field for the response
            cv = await newCV.populate('templateId');
        }

        // Rename 'templateId' to 'template' for client-side consistency
        const cvObject = cv.toObject();
        const responseData = { ...cvObject, template: cvObject.templateId };
        delete (responseData as any).templateId;

        res.json(responseData);

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu CV:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// POST /api/cv - Save/Update user's CV data
router.post('/', protect, async (req, res) => {
    try {
        const { templateId, ...cvData } = req.body;

        const updatePayload: any = cvData;
        if (templateId) {
            updatePayload.templateId = templateId;

            // Increment usageCount of the new template
            await CVTemplate.findByIdAndUpdate(templateId, { $inc: { usageCount: 1 } });
        }

        const cv = await CV.findOneAndUpdate(
            { userId: req.user!._id },
            updatePayload,
            { new: true, upsert: true, runValidators: true }
        ).populate('templateId');

        if (!cv) {
            return res.status(404).json({ message: 'Không tìm thấy CV để cập nhật.' });
        }

        // Rename for client
        const cvObject = cv.toObject();
        const responseData = { ...cvObject, template: cvObject.templateId };
        delete (responseData as any).templateId;

        res.status(200).json(responseData);
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
