import { GenerateContentParameters } from "@google/genai";
import { callAIAndParseJSON } from './gemini';
import { MajorSuggestion, CareerSuggestion, MajorDetails } from "../../../client/src/class/types";
import { majorSuggestionPrompt, careerSuggestionPrompt, majorDetailsPrompt } from "../config/prompts/exploration.prompts";

/**
 * Gợi ý các chuyên ngành dựa trên một lộ trình học tập.
 * @param roadmapName - Tên của lộ trình học tập.
 * @returns - Danh sách các gợi ý chuyên ngành.
 */
export const suggestMajorsForRoadmap = async (roadmapName: string): Promise<MajorSuggestion[]> => {
    const request: GenerateContentParameters = {
        model: majorSuggestionPrompt.model,
        contents: majorSuggestionPrompt.contents.replace("{{roadmapName}}", roadmapName),
        config: majorSuggestionPrompt.resSchema,
    };
    return callAIAndParseJSON<MajorSuggestion[]>(request);
};

/**
 * Gợi ý các nghề nghiệp dựa trên danh sách môn học yêu thích.
 * @param subjectNames - Mảng các tên môn học.
 * @returns - Danh sách các gợi ý nghề nghiệp.
 */
export const suggestCareersForSubjects = async (subjectNames: string[]): Promise<CareerSuggestion[]> => {
    const subjectsText = subjectNames.join(', ');
    const request: GenerateContentParameters = {
        model: careerSuggestionPrompt.model,
        contents: careerSuggestionPrompt.contents.replace("{{subjects}}", subjectsText),
        config: careerSuggestionPrompt.resSchema,
    };
    return callAIAndParseJSON<CareerSuggestion[]>(request);
};

/**
 * Lấy thông tin chi tiết về một chuyên ngành cụ thể.
 * @param majorName - Tên của chuyên ngành.
 * @returns - Đối tượng chứa thông tin chi tiết về chuyên ngành.
 */
export const getMajorDetails = async (majorName: string): Promise<MajorDetails> => {
    const request: GenerateContentParameters = {
        model: majorDetailsPrompt.model,
        contents: majorDetailsPrompt.contents.replace("{{majorName}}", majorName),
        config: majorDetailsPrompt.resSchema,
    };
    return callAIAndParseJSON<MajorDetails>(request);
};
