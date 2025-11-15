
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CVData, IUser, CVTemplate } from '../class/types';
import { getCVData, saveCVData, generateCVSummary, enhanceDescription, rewriteFullCV, getCVTemplates } from '../services/cvService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CVPreview from '../components/CVPreview';
import TemplateSelector from '../components/cv/TemplateSelector';
import TemplateEditor from '../components/cv/TemplateEditor'; // Import editor
import { UI_MESSAGES } from '../config/ui';
import { Plus, Trash2, Wand2, Loader2, Download, BrainCircuit, LayoutTemplate } from 'lucide-react';

const placeholderUser: IUser = { _id: 'p', fullName: 'P', userId: 'p', avatarUrl: '' };

type SaveStatus = 'idle' | 'saving' | 'saved';

const CVGeneratorPage: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || JSON.stringify(placeholderUser));

    const [cvData, setCVData] = useState<CVData | null>(null);
    const [templates, setTemplates] = useState<CVTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [aiLoading, setAiLoading] = useState<{ type: string, index?: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false); // State for editor
    const saveTimeoutRef = useRef<number | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cv, temps] = await Promise.all([getCVData(), getCVTemplates()]);
                setCVData(cv);
                setTemplates(temps);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Autosave logic
    useEffect(() => {
        if (isLoading || !cvData) return;

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        setSaveStatus('saving');

        saveTimeoutRef.current = window.setTimeout(() => {
            saveCVData(cvData)
                .then(() => {
                    setSaveStatus('saved');
                    setTimeout(() => setSaveStatus('idle'), 2000);
                })
                .catch(err => {
                    setError(err.message);
                    setSaveStatus('idle');
                });
        }, 1500); // 1.5 second debounce

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [cvData, isLoading]);

    const handleDownloadPDF = async () => {
        const element = document.getElementById('cv-preview-for-export');
        if (!element) return;
        setIsLoading(true);
        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, scrollY: 0, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = position - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            pdf.save(`${cvData?.personalDetails.fullName || 'cv'}_export.pdf`);
        } catch (e) {
            setError("Lỗi khi tạo file PDF.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRewriteCV = async () => {
        if (!cvData) return;
        setAiLoading({ type: 'full_rewrite' });
        setError(null);
        try {
            const rewrittenCV = await rewriteFullCV(cvData);
            setCVData(prev => prev ? { ...prev, ...rewrittenCV, template: prev.template } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi viết lại CV');
        } finally {
            setAiLoading(null);
        }
    };

    const handleGenerateSummary = async () => {
        if (!cvData) return;
        setAiLoading({ type: 'summary' });
        try {
            const { summary } = await generateCVSummary(cvData);
            setCVData(prev => prev ? { ...prev, summary } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi tạo tóm tắt');
        } finally {
            setAiLoading(null);
        }
    };

    const handleEnhanceDescription = async (section: 'experience' | 'projects', index: number) => {
        if (!cvData) return;
        const originalText = cvData[section][index].description || '';
        if (!originalText) return;
        setAiLoading({ type: section, index });
        try {
            const { enhancedDescription } = await enhanceDescription(originalText);
            handleArrayChange(section, index, 'description', enhancedDescription);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi tối ưu mô tả');
        } finally {
            setAiLoading(null);
        }
    }

    const handleInputChange = (section: keyof Omit<CVData, 'template'> | 'personalDetails', field: string, value: any) => {
        setCVData(prev => {
            if (!prev) return null;
            if (section === 'personalDetails') {
                return { ...prev, personalDetails: { ...prev.personalDetails, [field]: value } };
            }
            if (typeof prev[section as keyof CVData] === 'object' && !Array.isArray(prev[section as keyof CVData])) {
                const updatedSection = { ...(prev as any)[section], [field]: value };
                return { ...prev, [section]: updatedSection };
            }
            return { ...prev, [section as keyof CVData]: value };
        });
    };

    const handleArrayChange = (section: 'education' | 'experience' | 'skills' | 'projects', index: number, field: string, value: string) => {
        setCVData(prev => {
            if (!prev) return null;
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const addToArray = (section: 'education' | 'experience' | 'skills' | 'projects') => {
        setCVData(prev => {
            if (!prev) return null;
            let newItem: any;
            const id = Date.now().toString();
            switch (section) {
                case 'education': newItem = { id, school: '', degree: '' }; break;
                case 'experience': newItem = { id, company: '', jobTitle: '' }; break;
                case 'skills': newItem = { id, skillName: '' }; break;
                case 'projects': newItem = { id, projectName: '' }; break;
            }
            return { ...prev, [section]: [...prev[section], newItem] };
        });
    };

    const removeFromArray = (section: 'education' | 'experience' | 'skills' | 'projects', index: number) => {
        setCVData(prev => {
            if (!prev) return null;
            const newArray = prev[section].filter((_, i) => i !== index);
            return { ...prev, [section]: newArray };
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleFocusField = (fieldId: string) => {
        const element = document.querySelector(`[data-field-id="${fieldId}"]`) as HTMLElement;
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleAvatarClick = () => avatarInputRef.current?.click();

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('personalDetails', 'avatarUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTemplateSelect = (templateId: string) => {
        const selectedTemplate = templates.find(t => t._id === templateId);
        if (selectedTemplate && cvData) {
            setCVData({ ...cvData, template: selectedTemplate });
        }
    };

    const handleSaveNewTemplate = (newTemplate: CVTemplate) => {
        setTemplates(prev => [newTemplate, ...prev]);
        if (cvData) {
            setCVData({ ...cvData, template: newTemplate });
        }
    };

    if (isLoading && !cvData) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-12 h-12 text-indigo-600" /></div>
    if (!cvData) return <div className="text-center mt-10 text-red-500">{error || 'Lỗi khi tải dữ liệu CV.'}</div>

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col">
            <Header onLogout={handleLogout} currentUser={currentUser} />
            <main className="flex-grow p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{UI_MESSAGES.CV_GENERATOR.TITLE}</h1>
                            <p className="text-slate-600 dark:text-slate-400">{UI_MESSAGES.CV_GENERATOR.DESCRIPTION}</p>
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400 italic w-24 text-right">
                                {saveStatus === 'saving' && UI_MESSAGES.CV_GENERATOR.SAVE_STATUS_SAVING}
                                {saveStatus === 'saved' && UI_MESSAGES.CV_GENERATOR.SAVE_STATUS_SAVED}
                            </span>
                            <button onClick={handleRewriteCV} disabled={!!aiLoading} className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 rounded-lg shadow hover:bg-purple-200 disabled:opacity-50">
                                {aiLoading?.type === 'full_rewrite' ? <Loader2 className="animate-spin w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
                                {UI_MESSAGES.CV_GENERATOR.REWRITE_CV_BUTTON}
                            </button>
                            <button onClick={handleDownloadPDF} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-lg shadow hover:bg-green-200 disabled:opacity-50">
                                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                                {UI_MESSAGES.CV_GENERATOR.DOWNLOAD_PDF_BUTTON}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full max-h-[75vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4 dark:text-slate-100">{UI_MESSAGES.CV_GENERATOR.FORM_TITLE}</h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <TemplateSelector
                                        templates={templates}
                                        currentTemplateId={cvData.template?._id || ''}
                                        onSelectTemplate={handleTemplateSelect}
                                    />
                                    <button onClick={() => setIsTemplateEditorOpen(true)} className="ml-4 flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300 rounded-lg shadow hover:bg-gray-200">
                                        <LayoutTemplate className="w-4 h-4" /> Tạo mẫu mới
                                    </button>
                                </div>
                                <input type="file" ref={avatarInputRef} onChange={handleAvatarFileChange} accept="image/*" className="hidden" />
                                <div>
                                    <h3 className="font-semibold mb-2 dark:text-slate-300">Thông tin cá nhân</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input data-field-id="personalDetails.fullName" value={cvData.personalDetails.fullName} onChange={e => handleInputChange('personalDetails', 'fullName', e.target.value)} placeholder="Họ và tên" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                        <input data-field-id="personalDetails.jobTitle" value={cvData.personalDetails.jobTitle} onChange={e => handleInputChange('personalDetails', 'jobTitle', e.target.value)} placeholder="Chức danh" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                        <input data-field-id="personalDetails.email" value={cvData.personalDetails.email} onChange={e => handleInputChange('personalDetails', 'email', e.target.value)} placeholder="Email" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                        <input data-field-id="personalDetails.phoneNumber" value={cvData.personalDetails.phoneNumber} onChange={e => handleInputChange('personalDetails', 'phoneNumber', e.target.value)} placeholder="Số điện thoại" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                        <input data-field-id="personalDetails.address" value={cvData.personalDetails.address} onChange={e => handleInputChange('personalDetails', 'address', e.target.value)} placeholder="Địa chỉ" className="p-2 border rounded col-span-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2 dark:text-slate-300">Tóm tắt</h3>
                                    <textarea data-field-id="summary" value={cvData.summary} onChange={e => handleInputChange('summary', 'summary', e.target.value)} placeholder="Viết tóm tắt về bản thân..." rows={4} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                                    <button onClick={handleGenerateSummary} disabled={!!aiLoading} className="mt-2 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 disabled:text-gray-400">
                                        {aiLoading?.type === 'summary' ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                                        {UI_MESSAGES.CV_GENERATOR.AI_SUMMARY_BUTTON}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2 dark:text-slate-300">Kinh nghiệm làm việc</h3>
                                    {cvData.experience.map((exp, index) => (
                                        <div key={exp.id} className="p-4 border rounded mb-4 space-y-2 dark:border-slate-600">
                                            <input data-field-id={`experience.${index}.jobTitle`} value={exp.jobTitle} onChange={e => handleArrayChange('experience', index, 'jobTitle', e.target.value)} placeholder="Chức danh" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                            <input data-field-id={`experience.${index}.company`} value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} placeholder="Công ty" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                            <textarea data-field-id={`experience.${index}.description`} value={exp.description} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} placeholder="Mô tả công việc..." rows={3} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                                            <div className="flex justify-between items-center">
                                                <button onClick={() => handleEnhanceDescription('experience', index)} disabled={!!aiLoading} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 disabled:text-gray-400">
                                                    {aiLoading?.type === 'experience' && aiLoading?.index === index ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                                                    {UI_MESSAGES.CV_GENERATOR.AI_ENHANCE_BUTTON}
                                                </button>
                                                <button onClick={() => removeFromArray('experience', index)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => addToArray('experience')} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400"><Plus className="w-4 h-4" />Thêm kinh nghiệm</button>
                                </div>
                                {/* Thêm các mục khác (học vấn, kỹ năng, dự án) tương tự ở đây */}
                            </div>
                        </div>
                        <div className="h-[75vh] rounded-lg shadow-md overflow-hidden">
                            <CVPreview
                                cvData={cvData}
                                onFocusField={handleFocusField}
                                onEditAvatar={handleAvatarClick}
                            />
                        </div>
                    </div>
                </div>
            </main>
            {isTemplateEditorOpen && <TemplateEditor onClose={() => setIsTemplateEditorOpen(false)} onSave={handleSaveNewTemplate} />}
            <Footer />
        </div>
    );
};

export default CVGeneratorPage;
