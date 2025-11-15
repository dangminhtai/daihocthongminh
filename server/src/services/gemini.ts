import { GoogleGenAI, GenerateContentParameters } from "@google/genai";
import { QuizTurn, NextQuizStep, MajorDetails, MajorSuggestion, CareerSuggestion, QuizRecommendation } from "../../../client/src/class/types";
import dotenv from 'dotenv';

import { chatConfig } from "../config/prompts/chat.prompts";
import { majorSuggestionPrompt, careerSuggestionPrompt, majorDetailsPrompt } from "../config/prompts/exploration.prompts";
import { quizGeneratorPrompt, quizRecommendationPrompt } from "../config/prompts/quiz.prompts";
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
