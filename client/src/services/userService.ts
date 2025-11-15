import apiClient from './apiClient';
import { IUser } from '../class/types';

interface ProfileUpdateData {
    fullName: string;
    mssv: string;
    department?: string;
    class?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    bio?: string;
}

/**
 * Cập nhật thông tin hồ sơ người dùng
 */
export const updateProfile = (data: ProfileUpdateData): Promise<IUser> => {
    return apiClient.put<IUser>('/api/users/profile', data);
};

/**
 * Cập nhật ảnh đại diện người dùng
 */
export const updateAvatar = (formData: FormData): Promise<IUser> => {
    return apiClient.upload<IUser>('/api/users/avatar', formData);
};