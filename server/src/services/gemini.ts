
import dotenv from 'dotenv';

import { GoogleGenAI, GenerateContentParameters, Type } from "@google/genai";
import { QuizTurn, NextQuizStep, MajorDetails, MajorSuggestion, CareerSuggestion, QuizRecommendation } from "../../../client/src/class/types";
import { chatConfig } from "../config/prompts/chat.prompts";
import { majorSuggestionPrompt, careerSuggestionPrompt, majorDetailsPrompt } from "../config/prompts/exploration.prompts";
import { quizGeneratorPrompt, quizRecommendationPrompt } from "../config/prompts/quiz.prompts";
import { cvSummaryPrompt, cvEnhanceDescriptionPrompt, cvRewritePrompt } from '../config/prompts/cv.prompts';
dotenv.config();

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API Key chưa được cấu hình trên server. Vui lòng thêm API_KEY vào file .env của server.");
}
const ai = new GoogleGenAI({ apiKey });

// Helper function to safely parse JSON
async function callAIAndParseJSON<T>(request: GenerateContentParameters): Promise<T> {
    try {
        const response = await ai.models.generateContent(request);
        const jsonText = response.text;

        if (!jsonText) {
            throw new Error("Phản hồi từ AI không chứa nội dung văn bản.");
        }

        return JSON.parse(jsonText.trim()) as T;
    } catch (error: any) {
        console.error("Lỗi khi gọi AI hoặc parse JSON:", error);
        console.error("Request đã gửi:", JSON.stringify(request.contents, null, 2));
        if (error instanceof SyntaxError) {
            throw new Error(`Lỗi phân tích cú pháp JSON từ phản hồi của AI: ${error.message}`);
        }
        throw new Error(`Lỗi từ AI service: ${error.message}`);
    }
}


// --- CHAT SERVICE ---
export const getChatResponse = async (history: any[], message: string): Promise<string> => {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: history,
        config: {
            systemInstruction: chatConfig.systemInstruction,
        }
    });
    const response = await chat.sendMessage({ message });
    const responseText = response.text;

    if (typeof responseText !== 'string') {
        throw new Error("AI không đưa ra phản hồi hợp lệ.");
    }

    return responseText;
}

// --- EXPLORATION SERVICES ---

export const suggestMajorsForRoadmap = async (roadmapName: string): Promise<MajorSuggestion[]> => {
    const request: GenerateContentParameters = {
        model: majorSuggestionPrompt.model,
        contents: majorSuggestionPrompt.contents.replace("{{roadmapName}}", roadmapName),
        config: majorSuggestionPrompt.resSchema,
    };
    return callAIAndParseJSON<MajorSuggestion[]>(request);
};

export const suggestCareersForSubjects = async (subjectNames: string[]): Promise<CareerSuggestion[]> => {
    const subjectsText = subjectNames.join(', ');
    const request: GenerateContentParameters = {
        model: careerSuggestionPrompt.model,
        contents: careerSuggestionPrompt.contents.replace("{{subjects}}", subjectsText),
        config: careerSuggestionPrompt.resSchema,
    };
    return callAIAndParseJSON<CareerSuggestion[]>(request);
};

export const getMajorDetails = async (majorName: string): Promise<MajorDetails> => {
    const request: GenerateContentParameters = {
        model: majorDetailsPrompt.model,
        contents: majorDetailsPrompt.contents.replace("{{majorName}}", majorName),
        config: majorDetailsPrompt.resSchema,
    };
    return callAIAndParseJSON<MajorDetails>(request);
};

// --- QUIZ SERVICES ---

export const generateNextQuizQuestion = async (history: QuizTurn[]): Promise<NextQuizStep> => {
    const historyText = history.length > 0
        ? history.map(turn => `Q: ${turn.question}\nA: ${turn.answer}`).join('\n\n')
        : "Đây là câu hỏi đầu tiên.";

    const request: GenerateContentParameters = {
        model: quizGeneratorPrompt.model,
        contents: quizGeneratorPrompt.contents.replace("{{history}}", historyText),
        config: quizGeneratorPrompt.resSchema,
    };
    return callAIAndParseJSON<NextQuizStep>(request);
};

export const getQuizRecommendations = async (answers: QuizTurn[]): Promise<QuizRecommendation[]> => {
    const answersText = answers.map(a => `- ${a.question}: ${a.answer}`).join('\n');
    const request: GenerateContentParameters = {
        model: quizRecommendationPrompt.model,
        contents: quizRecommendationPrompt.contents.replace("{{answers}}", answersText),
        config: quizRecommendationPrompt.resSchema,
    };
    return callAIAndParseJSON<QuizRecommendation[]>(request);
};

// --- CV SERVICES ---

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