
import apiClient from './apiClient';
import { MajorSuggestion, CareerSuggestion, MajorDetails, QuizRecommendation, QuizTurn, NextQuizStep, School } from '../class/types';

/**
 * Gợi ý chuyên ngành dựa trên lộ trình học tập
 */
export const suggestMajorsForRoadmap = (roadmapName: string): Promise<MajorSuggestion[]> => {
  return apiClient.post<MajorSuggestion[]>('/api/exploration/suggest-majors', { roadmapName });
};

/**
 * Gợi ý nghề nghiệp dựa trên các môn học yêu thích
 */
export const suggestCareersForSubjects = (subjectNames: string[]): Promise<CareerSuggestion[]> => {
  return apiClient.post<CareerSuggestion[]>('/api/exploration/suggest-careers', { subjectNames });
};

/**
 * Lấy thông tin chi tiết về một chuyên ngành
 */
export const getMajorDetails = (majorName: string): Promise<MajorDetails> => {
  return apiClient.post<MajorDetails>('/api/exploration/major-details', { majorName });
};

/**
 * Tìm các trường học gần một vị trí cụ thể
 */
export const findNearbySchools = (schoolType: string, location: { latitude: number; longitude: number }): Promise<School[]> => {
  return apiClient.post<School[]>('/api/exploration/find-schools', { schoolType, location });
};

/**
 * Lấy một sự thật thú vị về nghề nghiệp
 * Tạm thời giữ lại ở client hoặc có thể tạo một endpoint riêng nếu cần
 */
import { GoogleGenAI } from "@google/genai";
import { geminiFactPrompt } from "../config/prompt/facts_conf";
import { ERROR_MESSAGES } from '../config/errors';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const getCareerFact = async (): Promise<string> => {
  if (!apiKey) throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
  try {
    const response = await ai.models.generateContent({
      model: geminiFactPrompt.model,
      contents: geminiFactPrompt.contents,
    });
    const fact = response.text.trim();
    if (!fact) return "Ngành công nghệ thông tin tại Việt Nam đang phát triển rất nhanh.";
    return fact;
  } catch (error) {
    console.error("Lỗi khi lấy sự thật thú vị:", error);
    return "Việt Nam là một trong những quốc gia xuất khẩu phần mềm hàng đầu trong khu vực Đông Nam Á.";
  }
};


/**
 * Tạo câu hỏi trắc nghiệm tiếp theo dựa trên lịch sử
 */
export const generateNextQuizQuestion = (history: QuizTurn[]): Promise<NextQuizStep> => {
  return apiClient.post<NextQuizStep>('/api/quiz/next-question', { history });
};

/**
 * Gợi ý nghề nghiệp dựa trên kết quả trắc nghiệm
 */
export const getQuizRecommendations = (history: QuizTurn[]): Promise<QuizRecommendation[]> => {
  return apiClient.post<QuizRecommendation[]>('/api/quiz/recommendations', { history });
};