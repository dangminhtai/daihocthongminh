
import apiClient from './apiClient';
import { IExploration, IQuizResult } from '../class/types';

// Kiểu dữ liệu này phải khớp với dữ liệu API trả về
type HistoryItem = (IExploration | IQuizResult) & { typeLabel: string };

/**
 * Lấy lịch sử hoạt động (khám phá, trắc nghiệm) của người dùng hiện tại
 */
export const getHistory = (): Promise<HistoryItem[]> => {
    return apiClient.get<HistoryItem[]>('/api/history');
};
