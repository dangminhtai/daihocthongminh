import { GenerateContentParameters } from "@google/genai";
import { ai, callAIAndParseJSON } from './gemini';
import { cvSummaryPrompt, cvEnhanceDescriptionPrompt, cvRewritePrompt } from '../config/prompts/cv.prompts';

/**
 * Tạo một đoạn tóm tắt (summary) cho CV dựa trên dữ liệu có sẵn.
 * @param cvData - Dữ liệu CV của người dùng.
 * @returns - Một chuỗi tóm tắt do AI tạo ra.
 */
export const generateCVSummary = async (cvData: any): Promise<string> => {
    const { personalDetails, education, experience, skills } = cvData;
    const educationStr = education.map((e: any) => `${e.degree} tại ${e.school}`).join('; ');
    const experienceStr = experience.map((e: any) => `${e.jobTitle} tại ${e.company}`).join('; ');
    const skillsStr = skills.map((s: any) => s.skillName).join(', ');

    const prompt = cvSummaryPrompt.contents
        .replace("{{jobTitle}}", personalDetails.jobTitle || 'Vị trí phù hợp')
        .replace("{{education}}", educationStr || 'Chưa có')
        .replace("{{experience}}", experienceStr || 'Chưa có')
        .replace("{{skills}}", skillsStr || 'Chưa có');

    const request: GenerateContentParameters = {
        model: cvSummaryPrompt.model,
        contents: prompt,
    };

    const response = await ai.models.generateContent(request);
    const summary = response.text;
    if (typeof summary !== 'string') {
        throw new Error("AI không tạo được tóm tắt.");
    }
    return summary.trim();
};

/**
 * Tối ưu hóa một đoạn mô tả công việc hoặc dự án.
 * @param description - Đoạn mô tả gốc.
 * @returns - Đoạn mô tả đã được AI tối ưu.
 */
export const enhanceJobDescription = async (description: string): Promise<string> => {
    if (!description) return "";

    const request: GenerateContentParameters = {
        model: cvEnhanceDescriptionPrompt.model,
        contents: cvEnhanceDescriptionPrompt.contents.replace("{{description}}", description),
    };

    const response = await ai.models.generateContent(request);
    const enhancedDescription = response.text;
    if (typeof enhancedDescription !== 'string') {
        throw new Error("AI không thể tối ưu mô tả.");
    }
    return enhancedDescription.trim();
};

/**
 * Viết lại các phần văn bản chính của toàn bộ CV.
 * @param cvData - Toàn bộ dữ liệu CV.
 * @returns - Một đối tượng chỉ chứa các phần đã được viết lại.
 */
export const rewriteCV = async (cvData: any): Promise<any> => {
    const request: GenerateContentParameters = {
        model: cvRewritePrompt.model,
        contents: cvRewritePrompt.contents.replace("{{cvJson}}", JSON.stringify(cvData, null, 2)),
        config: cvRewritePrompt.resSchema,
    };

    const rewrittenParts = await callAIAndParseJSON<{ summary: string; experience: { description: string }[]; projects: { description: string }[] }>(request);

    // Hợp nhất các phần đã viết lại vào dữ liệu CV gốc một cách an toàn
    const updatedCV = { ...cvData };
    updatedCV.summary = rewrittenParts.summary;

    if (rewrittenParts.experience && rewrittenParts.experience.length === cvData.experience.length) {
        updatedCV.experience = cvData.experience.map((exp: any, index: number) => ({
            ...exp,
            description: rewrittenParts.experience[index]?.description || exp.description,
        }));
    }

    if (rewrittenParts.projects && rewrittenParts.projects.length === cvData.projects.length) {
        updatedCV.projects = cvData.projects.map((proj: any, index: number) => ({
            ...proj,
            description: rewrittenParts.projects[index]?.description || proj.description,
        }));
    }

    return updatedCV;
};
