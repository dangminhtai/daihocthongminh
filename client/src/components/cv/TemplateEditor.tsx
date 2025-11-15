import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { CVTemplate, CVTemplateStructure } from '../../class/types';
import { createCVTemplate } from '../../services/cvService';

interface TemplateEditorProps {
    onClose: () => void;
    onSave: (newTemplate: CVTemplate) => void;
}

const allSections = ['summary', 'experience', 'education', 'projects', 'skills'];

const sectionLabels: { [key: string]: string } = {
    summary: 'Tóm tắt',
    experience: 'Kinh nghiệm làm việc',
    education: 'Học vấn',
    projects: 'Dự án',
    skills: 'Kỹ năng',
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [layout, setLayout] = useState<CVTemplateStructure['layout']>('classic');
    const [sectionOrder, setSectionOrder] = useState(allSections);
    const [isPublic, setIsPublic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...sectionOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newOrder.length) {
            [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
            setSectionOrder(newOrder);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Tên mẫu không được để trống.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const structure: CVTemplateStructure = { layout, sectionOrder };
            const newTemplateData = { name, description, structure, isPublic };
            const savedTemplate = await createCVTemplate(newTemplateData);
            onSave(savedTemplate);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định khi lưu mẫu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">Tạo Mẫu CV Mới</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X /></button>
                </div>
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium dark:text-slate-300">Tên mẫu *</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-slate-300">Bố cục</label>
                            <select value={layout} onChange={e => setLayout(e.target.value as any)} className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="classic">Cổ điển (1 cột)</option>
                                <option value="modern">Hiện đại (2 cột)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-slate-300">Mô tả</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-slate-300 mb-2">Thứ tự các mục</label>
                        <p className="text-xs text-slate-500 mb-3">Sắp xếp thứ tự các mục sẽ hiển thị trong phần nội dung chính của CV. Lưu ý: Trong bố cục "Hiện đại", mục "Kỹ năng" sẽ luôn nằm ở cột bên.</p>
                        <ul className="space-y-2">
                            {sectionOrder.map((section, index) => (
                                <li key={section} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
                                    <span className="font-medium dark:text-slate-200 capitalize">{sectionLabels[section] || section}</span>
                                    <div className="space-x-2">
                                        <button onClick={() => handleMoveSection(index, 'up')} disabled={index === 0} className="disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"><ArrowUp size={18} /></button>
                                        <button onClick={() => handleMoveSection(index, 'down')} disabled={index === sectionOrder.length - 1} className="disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"><ArrowDown size={18} /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isPublic" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-slate-300">Chia sẻ mẫu này với cộng đồng</label>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700 flex justify-end">
                    <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait">
                        {isLoading ? <><Loader2 className="animate-spin" size={18} /> Đang lưu...</> : <><Save size={18} /> Lưu Mẫu</>}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TemplateEditor;
