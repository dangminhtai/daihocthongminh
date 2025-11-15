
import { GoogleGenAI } from "@google/genai";
import { MajorSuggestion, CareerSuggestion, MajorDetails, QuizRecommendation } from '../class/types';
import { geminiMajorPrompt } from '../config/prompt/majors/gemini_conf';
import { geminiCareerPrompt } from '../config/prompt/careers/gemini_conf';
import { geminiMajorDetailsPrompt } from '../config/prompt/majors/gemini_details_conf';
import { geminiFactPrompt } from "../config/prompt/facts_conf";
import { geminiQuizPrompt } from "../config/prompt/quiz_conf";
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

/**
 * Lấy thông tin chi tiết về một chuyên ngành
 * @param majorName - Tên chuyên ngành
 * @returns Chi tiết chuyên ngành
 */
export const getMajorDetails = async (majorName: string): Promise<MajorDetails> => {
  try {
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    const response = await ai.models.generateContent({
      model: geminiMajorDetailsPrompt.model,
      contents: geminiMajorDetailsPrompt.contents.replace("{{majorName}}", majorName),
      config: geminiMajorDetailsPrompt.resSchema,
    });

    const jsonText = response.text.trim();
    const details: MajorDetails = JSON.parse(jsonText);
    return details;
  } catch (error: any) {
    console.error(`Lỗi khi lấy chi tiết chuyên ngành ${majorName}:`, error);
    const errorMessage = error?.message || `Không thể lấy chi tiết cho chuyên ngành ${majorName}.`;
    throw new Error(errorMessage);
  }
};

/**
 * Lấy một sự thật thú vị về nghề nghiệp
 * @returns Một chuỗi chứa sự thật thú vị
 */
export const getCareerFact = async (): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    const response = await ai.models.generateContent({
      model: geminiFactPrompt.model,
      contents: geminiFactPrompt.contents,
    });

    const fact = response.text.trim();
    if (!fact) {
      throw new Error("Không thể tạo sự thật thú vị.");
    }
    return fact;
  } catch (error: any) {
    console.error("Lỗi khi lấy sự thật thú vị:", error);
    // Trả về một sự thật dự phòng để không làm hỏng giao diện
    return "Việt Nam là một trong những quốc gia xuất khẩu phần mềm hàng đầu trong khu vực Đông Nam Á.";
  }
};

/**
 * Gợi ý nghề nghiệp dựa trên kết quả trắc nghiệm
 * @param answers - Mảng các câu trả lời của người dùng
 * @returns Danh sách gợi ý nghề nghiệp được cá nhân hóa
 */
export const getQuizRecommendations = async (answers: { question: string, answer: string }[]): Promise<QuizRecommendation[]> => {
  try {
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    const answersText = answers.map(a => `- ${a.question}: ${a.answer}`).join('\n');

    const response = await ai.models.generateContent({
      model: geminiQuizPrompt.model,
      contents: geminiQuizPrompt.contents.replace("{{answers}}", answersText),
      config: geminiQuizPrompt.resSchema,
    });

    const jsonText = response.text.trim();
    const recommendations: QuizRecommendation[] = JSON.parse(jsonText);
    return recommendations;
  } catch (error: any) {
    console.error("Lỗi khi gọi Gemini API để gợi ý từ trắc nghiệm:", error);
    const errorMessage = error?.message || "Không thể nhận được gợi ý. Vui lòng thử lại.";
    throw new Error(errorMessage);
  }
};
