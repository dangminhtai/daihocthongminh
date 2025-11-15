import apiClient from './apiClient';

export const forgotPassword = async (gmail: string): Promise<{ message: string }> => {
    return apiClient.post('/api/auth/forgot-password', { gmail });
};

export const resetPassword = async (gmail: string, otp: string, newPassword: string): Promise<{ message: string }> => {
    return apiClient.post('/api/auth/reset-password', { gmail, otp, newPassword });
};
