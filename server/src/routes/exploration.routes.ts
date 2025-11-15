import express from 'express';
import { protect } from '../middleware/auth.middleware';
import Exploration from '../models/exploration.model';
import { EXPLORATION_TYPES } from '../models/constants';
import {
    suggestMajorsForRoadmap as suggestMajorsFromAI,
    suggestCareersForSubjects as suggestCareersFromAI,
    getMajorDetails as getMajorDetailsFromAI
} from '../services/gemini';

const router = express.Router();

// Gợi ý chuyên ngành theo lộ trình
router.post('/suggest-majors', protect, async (req, res) => {
    const { roadmapName } = req.body;
    if (!roadmapName) return res.status(400).json({ message: "Thiếu roadmapName" });

    try {
        const suggestions = await suggestMajorsFromAI(roadmapName);

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
        const suggestions = await suggestCareersFromAI(subjectNames);

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
        const details = await getMajorDetailsFromAI(majorName);
        res.status(200).json(details);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
});

export default router;
