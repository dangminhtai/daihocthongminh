
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
import facts from '../data/facts.json';

export const getCareerFact = async (): Promise<string> => {
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  return randomFact;
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