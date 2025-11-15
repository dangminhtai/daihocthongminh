
import apiClient from './apiClient';
import { CVData, CVTemplate } from '../class/types';

/**
 * Lấy dữ liệu CV của người dùng hiện tại (đã populate template)
 */
export const getCVData = (): Promise<CVData> => {
    return apiClient.get<CVData>('/api/cv');
};

/**
 * Lưu dữ liệu CV của người dùng hiện tại
 */
export const saveCVData = (cvData: CVData): Promise<CVData> => {
    // Backend mong đợi templateId, không phải toàn bộ object template
    const payload = {
        ...cvData,
        templateId: cvData.template._id
    };
    delete (payload as any).template;

    return apiClient.post<CVData>('/api/cv', payload);
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

/**
 * Lấy danh sách các mẫu CV có sẵn
 */
export const getCVTemplates = (sortBy: 'popularity' | 'rating' | 'newest' = 'popularity'): Promise<CVTemplate[]> => {
    return apiClient.get<CVTemplate[]>(`/api/cv-templates?sortBy=${sortBy}`);
};

/**
 * Tạo một mẫu CV mới
 */
export const createCVTemplate = (templateData: Partial<CVTemplate>): Promise<CVTemplate> => {
    return apiClient.post<CVTemplate>('/api/cv-templates', templateData);
};

/**
 * Đánh giá một mẫu CV
 */
export const rateCVTemplate = (templateId: string, rating: number): Promise<CVTemplate> => {
    return apiClient.post<CVTemplate>(`/api/cv-templates/${templateId}/rate`, { rating });
};
