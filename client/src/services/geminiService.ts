
import { GoogleGenAI } from "@google/genai";
import { MajorSuggestion, CareerSuggestion } from '../class/types';
import { geminiMajorPrompt } from '../config/prompt/majors/gemini_conf';
import { geminiCareerPrompt } from '../config/prompt/careers/gemini_conf';
// FIX: Xóa import không sử dụng
import { ERROR_MESSAGES, ERROR_LOG_MESSAGES } from '../config/errors';

// Initialize API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error(`LỖI: ${ERROR_MESSAGES.API_KEY_NOT_CONFIGURED}`);
}

// Initialize Gemini AI client
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Gợi ý chuyên ngành dựa trên lộ trình học tập
 * @param roadmapName - Tên lộ trình học tập
 * @returns Danh sách gợi ý chuyên ngành
 */
export const suggestMajorsForRoadmap = async (roadmapName: string): Promise<MajorSuggestion[]> => {
  try {
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    const response = await ai.models.generateContent({
      model: geminiMajorPrompt.model,
      contents: geminiMajorPrompt.contents.replace("{{roadmapName}}", roadmapName),
      config: geminiMajorPrompt.resSchema,
    });

    const jsonText = response.text.trim();
    const suggestions: MajorSuggestion[] = JSON.parse(jsonText);
    return suggestions;
  } catch (error: any) {
    console.error(ERROR_LOG_MESSAGES.MAJOR_SUGGESTION_ERROR, error);
    const errorMessage = error?.message || ERROR_MESSAGES.MAJOR_SUGGESTION_FAILED;
    throw new Error(errorMessage);
  }
};

/**
 * Gợi ý nghề nghiệp dựa trên các môn học yêu thích
 * @param subjectNames - Danh sách tên môn học
 * @returns Danh sách gợi ý nghề nghiệp
 */
export const suggestCareersForSubjects = async (subjectNames: string[]): Promise<CareerSuggestion[]> => {
  try {
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    const subjectsText = subjectNames.join(', ');
    const response = await ai.models.generateContent({
      model: geminiCareerPrompt.model,
      contents: geminiCareerPrompt.contents.replace("{{subjects}}", subjectsText),
      config: geminiCareerPrompt.resSchema,
    });

    const jsonText = response.text.trim();
    const suggestions: CareerSuggestion[] = JSON.parse(jsonText);
    return suggestions;
  } catch (error: any) {
    console.error(ERROR_LOG_MESSAGES.CAREER_SUGGESTION_ERROR, error);
    const errorMessage = error?.message || ERROR_MESSAGES.CAREER_SUGGESTION_FAILED;
    throw new Error(errorMessage);
  }
};
