
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, GripVertical } from 'lucide-react';
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
    const [includedSections, setIncludedSections] = useState(allSections);
    const [availableSections, setAvailableSections] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [draggedItem, setDraggedItem] = useState<{ section: string; index: number; from: 'included' | 'available' } | null>(null);

    const handleDragStart = (e: React.DragEvent, section: string, index: number, from: 'included' | 'available') => {
        setDraggedItem({ section, index, from });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDropOnIncluded = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;

        const { section, from } = draggedItem;

        if (from === 'included') {
            const newOrder = [...includedSections];
            const [removed] = newOrder.splice(draggedItem.index, 1);
            newOrder.splice(dropIndex, 0, removed);
            setIncludedSections(newOrder);
        } else {
            setIncludedSections(prev => {
                const newIncluded = [...prev];
                newIncluded.splice(dropIndex, 0, section);
                return newIncluded;
            });
            setAvailableSections(prev => prev.filter(s => s !== section));
        }
        setDraggedItem(null);
    };

    const handleDropOnAvailable = (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.from !== 'included') return;

        const { section } = draggedItem;
        setAvailableSections(prev => [...prev, section].sort((a, b) => allSections.indexOf(a) - allSections.indexOf(b)));
        setIncludedSections(prev => prev.filter(s => s !== section));
        setDraggedItem(null);
    };


    const handleSave = async () => {
        if (!name.trim()) {
            setError('Tên mẫu không được để trống.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const structure: CVTemplateStructure = { layout, sectionOrder: includedSections };
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
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
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
                        <label className="block text-sm font-medium dark:text-slate-300">Mô tả (tùy chọn)</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-slate-300 mb-2">Tùy chỉnh các mục</label>
                        <p className="text-xs text-slate-500 mb-3">Kéo thả các mục giữa hai cột để thêm/bớt. Kéo thả trong cột bên phải để sắp xếp lại thứ tự.</p>
                        <div className="grid grid-cols-2 gap-6">
                            <div
                                className="border-2 border-dashed dark:border-slate-600 rounded-lg p-4 min-h-[200px]"
                                onDragOver={handleDragOver}
                                onDrop={handleDropOnAvailable}
                            >
                                <h4 className="font-semibold mb-3 dark:text-slate-200">Các mục có thể thêm</h4>
                                <div className="space-y-2">
                                    {availableSections.map((section, index) => (
                                        <div
                                            key={section}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, section, index, 'available')}
                                            className="flex items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-md cursor-grab active:cursor-grabbing"
                                        >
                                            <GripVertical size={16} className="mr-2 text-slate-400" />
                                            <span className="font-medium dark:text-slate-200 capitalize">{sectionLabels[section] || section}</span>
                                        </div>
                                    ))}
                                    {availableSections.length === 0 && <p className="text-sm text-slate-400 text-center pt-8">Tất cả các mục đã được sử dụng.</p>}
                                </div>
                            </div>
                            <div className="border dark:border-slate-600 rounded-lg p-4 min-h-[200px] bg-slate-50 dark:bg-slate-900/50">
                                <h4 className="font-semibold mb-3 dark:text-slate-200">Các mục trong mẫu của bạn</h4>
                                <div className="space-y-2" onDragOver={handleDragOver}>
                                    {includedSections.map((section, index) => (
                                        <div
                                            key={section}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, section, index, 'included')}
                                            onDrop={(e) => handleDropOnIncluded(e, index)}
                                            className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded-md shadow-sm cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="flex items-center">
                                                <GripVertical size={16} className="mr-2 text-slate-400" />
                                                <span className="font-medium dark:text-slate-200 capitalize">{sectionLabels[section] || section}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div onDrop={(e) => handleDropOnIncluded(e, includedSections.length)} className="h-10"></div>
                                    {includedSections.length === 0 && <p className="text-sm text-slate-400 text-center pt-8">Kéo các mục từ cột trái vào đây.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isPublic" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-slate-300">Chia sẻ mẫu này với cộng đồng</label>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700 flex justify-end flex-shrink-0">
                    <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait">
                        {isLoading ? <><Loader2 className="animate-spin" size={18} /> Đang lưu...</> : <><Save size={18} /> Lưu Mẫu</>}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TemplateEditor;
