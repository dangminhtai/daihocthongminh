
import apiClient from './apiClient';
import { Theme } from '../contexts/ThemeContext';

interface ISettings {
    _id: string;
    userId: string;
    theme: Theme;
    createdAt: string;
    updatedAt: string;
}

/**
 * Lấy cài đặt của người dùng hiện tại
 */
export const getSettings = (): Promise<ISettings> => {
    return apiClient.get<ISettings>('/api/settings');
};

/**
 * Cập nhật cài đặt của người dùng hiện tại
 */
export const updateSettings = (theme: Theme): Promise<ISettings> => {
    return apiClient.put<ISettings>('/api/settings', { theme });
};
