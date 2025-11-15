import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../class/types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    User, Mail, CreditCard, Camera, Upload, Edit, X, Save,
    Building, Users, Calendar, Phone, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { updateProfile, updateAvatar } from '../services/userService';
import AvatarCameraModal from '../components/AvatarCameraModal';

/* -------------------------------------------------------
    COMPONENT CON – ĐƯA RA NGOÀI, ĐỠ RE-RENDER VÔ LÝ
--------------------------------------------------------*/

const InfoRow = React.memo(
    ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | undefined | null }) => (
        <div className="flex items-start space-x-4">
            <div className="text-indigo-500 dark:text-indigo-400 mt-1 flex-shrink-0">{icon}</div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100 break-words">
                    {value || <span className="text-gray-400 dark:text-gray-500 font-normal">Chưa cập nhật</span>}
                </p>
            </div>
        </div>
    )
);

const FormField = React.memo(
    ({ id, label, value, onChange, type = "text", icon, as = "input" }: any) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                {icon} {label}
            </label>

            {as === "textarea" ? (
                <textarea
                    name={id}
                    id={id}
                    value={value}
                    onChange={onChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm 
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-transparent dark:text-white"
                />
            ) : (
                <input
                    type={type}
                    name={id}
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm 
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-transparent dark:text-white"
                />
            )}
        </div>
    )
);

/* -------------------------------------------------------
    COMPONENT CHÍNH
--------------------------------------------------------*/

interface ProfilePageProps {
    currentUser: IUser;
    onUpdateUser: (user: IUser) => void;
    onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateUser, onLogout }) => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState(() => ({
        fullName: currentUser.fullName || '',
        mssv: currentUser.mssv || '',
        department: currentUser.department || '',
        class: currentUser.class || '',
        dateOfBirth: currentUser.dateOfBirth ? currentUser.dateOfBirth.split('T')[0] : '',
        phoneNumber: currentUser.phoneNumber || '',
        bio: currentUser.bio || '',
    }));

    const resetForm = useCallback(() => {
        setFormData({
            fullName: currentUser.fullName || '',
            mssv: currentUser.mssv || '',
            department: currentUser.department || '',
            class: currentUser.class || '',
            dateOfBirth: currentUser.dateOfBirth ? currentUser.dateOfBirth.split('T')[0] : '',
            phoneNumber: currentUser.phoneNumber || '',
            bio: currentUser.bio || '',
        });
    }, [currentUser]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        },
        []
    );

    const handleEditToggle = useCallback(() => {
        if (isEditing) resetForm();
        setIsEditing(prev => !prev);
        setError(null);
        setSuccess(null);
    }, [isEditing, resetForm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedUser = await updateProfile(formData);
            onUpdateUser(updatedUser);

            setSuccess("Cập nhật thông tin thành công!");
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        const data = new FormData();
        data.append('avatar', file);

        setIsAvatarLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedUser = await updateAvatar(data);
            onUpdateUser(updatedUser);

            setSuccess("Cập nhật ảnh đại diện thành công!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi tải ảnh đại diện");
        } finally {
            setIsAvatarLoading(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleAvatarUpload(file);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            <Header onLogout={onLogout} currentUser={currentUser} />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">

                    <button
                        onClick={() => navigate("/home")}
                        className="mb-6 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                        ← Quay lại trang chủ
                    </button>

                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
                        Hồ sơ cá nhân
                    </h1>

                    <div className="grid md:grid-cols-3 gap-8 mb-8">

                        {/* Avatar */}
                        <div className="md:col-span-1 flex flex-col items-center space-y-4">
                            <div className="relative group">
                                <img
                                    src={currentUser.avatarUrl}
                                    alt="Avatar"
                                    className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-700"
                                />

                                {isAvatarLoading && (
                                    <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 flex items-center justify-center rounded-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={onFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium 
                                    text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 
                                    rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Tải ảnh</span>
                                </button>

                                <button
                                    onClick={() => setIsCameraModalOpen(true)}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium 
                                    text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 
                                    rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/80 transition"
                                >
                                    <Camera className="w-4 h-4" />
                                    <span>Chụp ảnh</span>
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="md:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md"
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
                                        Thông tin chi tiết
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={handleEditToggle}
                                        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium 
                                        text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 
                                        rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                                    >
                                        {isEditing ? (
                                            <>
                                                <X className="w-4 h-4" />
                                                <span>Hủy</span>
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="w-4 h-4" />
                                                <span>Chỉnh sửa</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {(error || success) && (
                                    <div className={`text-sm mb-4 p-3 rounded-md ${error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                        {error || success}
                                    </div>
                                )}

                                <div className="space-y-6">

                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <FormField id="fullName" label="Họ và tên" value={formData.fullName} onChange={handleInputChange} icon={<User className="w-4 h-4 mr-2" />} />
                                            <FormField id="mssv" label="Mã số sinh viên" value={formData.mssv} onChange={handleInputChange} icon={<CreditCard className="w-4 h-4 mr-2" />} />
                                            <FormField id="department" label="Khoa" value={formData.department} onChange={handleInputChange} icon={<Building className="w-4 h-4 mr-2" />} />
                                            <FormField id="class" label="Lớp" value={formData.class} onChange={handleInputChange} icon={<Users className="w-4 h-4 mr-2" />} />
                                            <FormField id="dateOfBirth" label="Ngày sinh" value={formData.dateOfBirth} onChange={handleInputChange} type="date" icon={<Calendar className="w-4 h-4 mr-2" />} />
                                            <FormField id="phoneNumber" label="Số điện thoại" value={formData.phoneNumber} onChange={handleInputChange} icon={<Phone className="w-4 h-4 mr-2" />} />
                                            <FormField id="bio" label="Mô tả bản thân" value={formData.bio} onChange={handleInputChange} as="textarea" icon={<FileText className="w-4 h-4 mr-2" />} />
                                        </div>
                                    ) : (
                                        <>
                                            <InfoRow icon={<User className="w-5 h-5" />} label="Họ và tên" value={currentUser.fullName} />
                                            <InfoRow icon={<CreditCard className="w-5 h-5" />} label="Mã số sinh viên" value={currentUser.mssv} />
                                            <InfoRow icon={<Building className="w-5 h-5" />} label="Khoa" value={currentUser.department} />
                                            <InfoRow icon={<Users className="w-5 h-5" />} label="Lớp" value={currentUser.class} />
                                            <InfoRow icon={<Calendar className="w-5 h-5" />} label="Ngày sinh" value={currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toLocaleDateString('vi-VN') : null} />
                                            <InfoRow icon={<Phone className="w-5 h-5" />} label="Số điện thoại" value={currentUser.phoneNumber} />
                                            <InfoRow icon={<FileText className="w-5 h-5" />} label="Mô tả bản thân" value={currentUser.bio} />
                                            <InfoRow icon={<Mail className="w-5 h-5" />} label="User ID" value={`#${currentUser.userId}`} />
                                        </>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="mt-8 text-right">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="inline-flex items-center px-6 py-2 border border-transparent 
                                            text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 
                                            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                            focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />

            <AvatarCameraModal
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onCapture={handleAvatarUpload}
            />
        </div>
    );
};

export default ProfilePage;
