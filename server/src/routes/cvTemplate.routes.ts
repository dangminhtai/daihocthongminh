
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { CVTemplate } from '../models/cvTemplate.model';

const router = express.Router();

// GET /api/cv-templates - Lấy danh sách template công khai
router.get('/', protect, async (req, res) => {
    const { sortBy = 'popularity' } = req.query;

    let sortQuery: any = { usageCount: -1, averageRating: -1 }; // Mặc định là popularity
    if (sortBy === 'rating') {
        sortQuery = { averageRating: -1, usageCount: -1 };
    }
    if (sortBy === 'newest') {
        sortQuery = { createdAt: -1 };
    }

    try {
        // Lấy cả template công khai và template của chính người dùng đó
        const templates = await CVTemplate.find({
            $or: [
                { isPublic: true },
                { createdBy: req.user!._id }
            ]
        }).sort(sortQuery).populate('createdBy', 'fullName');

        res.json(templates);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách template CV:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy template' });
    }
});

// POST /api/cv-templates - Tạo một template mới
router.post('/', protect, async (req, res) => {
    const { name, description, structure, isPublic } = req.body;

    if (!name || !structure || !structure.layout || !structure.sectionOrder) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo template.' });
    }

    try {
        const newTemplate = new CVTemplate({
            name,
            description,
            structure,
            isPublic,
            createdBy: req.user!._id,
            // thumbnailUrl sẽ được tạo sau
        });

        await newTemplate.save();
        res.status(201).json(newTemplate);

    } catch (error) {
        console.error("Lỗi khi tạo template CV:", error);
        res.status(500).json({ message: 'Lỗi server khi tạo template' });
    }
});


// PUT /api/cv-templates/:id - Cập nhật template
router.put('/:id', protect, async (req, res) => {
    const { name, description, structure, isPublic } = req.body;
    const { id } = req.params;

    try {
        const template = await CVTemplate.findById(id);

        if (!template) {
            return res.status(404).json({ message: 'Không tìm thấy template.' });
        }

        // Chỉ người tạo mới có quyền sửa
        if (template.createdBy.toString() !== (req.user as any)._id.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền sửa template này.' });
        }


        template.name = name ?? template.name;
        template.description = description ?? template.description;
        template.structure = structure ?? template.structure;
        template.isPublic = isPublic ?? template.isPublic;

        await template.save();
        res.json(template);

    } catch (error) {
        console.error("Lỗi khi cập nhật template:", error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật template.' });
    }
});


export default router;