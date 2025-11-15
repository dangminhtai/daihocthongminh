
import apiClient from './apiClient';
import { CVData } from '../class/types';

/**
 * Lấy dữ liệu CV của người dùng hiện tại
 */
export const getCVData = (): Promise<CVData> => {
    return apiClient.get<CVData>('/api/cv');
};

/**
 * Lưu dữ liệu CV của người dùng hiện tại
 */
export const saveCVData = (cvData: CVData): Promise<CVData> => {
    return apiClient.post<CVData>('/api/cv', cvData);
};

/**
 * Gọi AI để tạo tóm tắt CV
 */
export const generateCVSummary = (cvData: Partial<CVData>): Promise<{ summary: string }> => {
    return apiClient.post<{ summary: string }>('/api/cv/generate-summary', cvData);
};

/**
 * Gọi AI để tối ưu mô tả công việc/dự án
 */
export const enhanceDescription = (description: string): Promise<{ enhancedDescription: string }> => {
    return apiClient.post<{ enhancedDescription: string }>('/api/cv/enhance-description', { description });
};

/**
 * Gọi AI để viết lại toàn bộ CV
 */
export const rewriteFullCV = (cvData: CVData): Promise<CVData> => {
    return apiClient.post<CVData>('/api/cv/rewrite', cvData);
};