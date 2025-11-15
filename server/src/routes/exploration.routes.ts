
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import Exploration from '../models/exploration.model';
import { EXPLORATION_TYPES } from '../models/constants';
import {
    suggestMajorsForRoadmap,
    suggestCareersForSubjects,
    getMajorDetails,
    findSchoolsNearLocation
} from '../services/explorationAi.service';

const router = express.Router();

// Gợi ý chuyên ngành theo lộ trình
router.post('/suggest-majors', protect, async (req, res) => {
    const { roadmapName } = req.body;
    if (!roadmapName) return res.status(400).json({ message: "Thiếu roadmapName" });

    try {
        const suggestions = await suggestMajorsForRoadmap(roadmapName);

        const exploration = new Exploration({
            userId: req.user!._id,
            type: EXPLORATION_TYPES.ROADMAP,
            input: { roadmapName },
            results: suggestions,
        });
        await exploration.save();

        res.status(200).json(suggestions);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
});

// Gợi ý nghề nghiệp theo môn học
router.post('/suggest-careers', protect, async (req, res) => {
    const { subjectNames } = req.body;
    if (!subjectNames || !Array.isArray(subjectNames) || subjectNames.length === 0) {
        return res.status(400).json({ message: "subjectNames phải là một mảng không rỗng" });
    }

    try {
        const suggestions = await suggestCareersForSubjects(subjectNames);

        const exploration = new Exploration({
            userId: req.user!._id,
            type: EXPLORATION_TYPES.SUBJECTS,
            input: { subjects: subjectNames },
            results: suggestions,
        });
        await exploration.save();

        res.status(200).json(suggestions);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
});

// Lấy chi tiết chuyên ngành
router.post('/major-details', protect, async (req, res) => {
    const { majorName } = req.body;
    if (!majorName) return res.status(400).json({ message: "Thiếu majorName" });

    try {
        const details = await getMajorDetails(majorName);
        res.status(200).json(details);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
});

// Tìm trường học lân cận
router.post('/find-schools', protect, async (req, res) => {
    const { schoolType, location } = req.body;
    if (!schoolType || !location || !location.latitude || !location.longitude) {
        return res.status(400).json({ message: 'Thiếu thông tin loại trường hoặc vị trí.' });
    }

    try {
        const schools = await findSchoolsNearLocation(schoolType, location);
        res.status(200).json(schools);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server khi tìm trường học." });
    }
});

export default router;