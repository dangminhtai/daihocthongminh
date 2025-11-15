import { GenerateContentParameters } from "@google/genai";
import { callAIAndParseJSON } from './gemini';
import { QuizTurn, NextQuizStep, QuizRecommendation } from "../../../client/src/class/types";
import { quizGeneratorPrompt, quizRecommendationPrompt } from "../config/prompts/quiz.prompts";

/**
 * Tạo câu hỏi trắc nghiệm tiếp theo dựa trên lịch sử câu trả lời.
 * @param history - Mảng các lượt hỏi và trả lời trước đó.
 * @returns - Đối tượng chứa câu hỏi tiếp theo hoặc trạng thái hoàn thành.
 */
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

/**
 * Đưa ra gợi ý nghề nghiệp cuối cùng dựa trên toàn bộ lịch sử trắc nghiệm.
 * @param answers - Mảng các lượt hỏi và trả lời.
 * @returns - Danh sách các gợi ý nghề nghiệp.
 */
export const getQuizRecommendations = async (answers: QuizTurn[]): Promise<QuizRecommendation[]> => {
    const answersText = answers.map(a => `- ${a.question}: ${a.answer}`).join('\n');
    const request: GenerateContentParameters = {
        model: quizRecommendationPrompt.model,
        contents: quizRecommendationPrompt.contents.replace("{{answers}}", answersText),
        config: quizRecommendationPrompt.resSchema,
    };
    return callAIAndParseJSON<QuizRecommendation[]>(request);
};
