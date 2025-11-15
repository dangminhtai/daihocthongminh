
import apiClient from './apiClient';

export interface RatingStats {
    count: number;
    average: number;
}

/**
 * Gửi đánh giá của người dùng
 */
export const submitRating = (rating: number, feedback: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/api/ratings', { rating, feedback });
};

/**
 * Lấy thống kê về rating
 */
export const getRatingStats = (): Promise<RatingStats> => {
    return apiClient.get<RatingStats>('/api/ratings/stats');
};
