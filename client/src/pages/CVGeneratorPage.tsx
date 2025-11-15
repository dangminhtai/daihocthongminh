
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CVData, IUser } from '../class/types';
import { getCVData, saveCVData, generateCVSummary, enhanceDescription, rewriteFullCV } from '../services/cvService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CVPreview from '../components/CVPreview';
import { UI_MESSAGES } from '../config/ui';
import { Plus, Trash2, Wand2, Loader2, Download, BrainCircuit } from 'lucide-react';

const placeholderUser: IUser = { _id: 'p', fullName: 'P', userId: 'p', avatarUrl: '' };

type SaveStatus = 'idle' | 'saving' | 'saved';

const CVGeneratorPage: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || JSON.stringify(placeholderUser));

    const [cvData, setCVData] = useState<CVData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [aiLoading, setAiLoading] = useState<{ type: string, index?: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const saveTimeoutRef = useRef<number | null>(null);

    // Initial data fetch
    useEffect(() => {
        getCVData()
            .then(data => setCVData(data))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
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
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, scrollY: -window.scrollY });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
                position = -pdf.internal.pageSize.getHeight() + position;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
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
            setCVData(rewrittenCV);
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

    const handleInputChange = (section: keyof CVData | 'personalDetails', field: string, value: string) => {
        setCVData(prev => {
            if (!prev) return null;
            if (section === 'personalDetails') {
                return { ...prev, personalDetails: { ...prev.personalDetails, [field]: value } };
            }
            return { ...prev, [field]: value };
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
            switch (section) {
                case 'education': newItem = { id: Date.now().toString(), school: '', degree: '' }; break;
                case 'experience': newItem = { id: Date.now().toString(), company: '', jobTitle: '' }; break;
                case 'skills': newItem = { id: Date.now().toString(), skillName: '' }; break;
                case 'projects': newItem = { id: Date.now().toString(), projectName: '' }; break;
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

    if (isLoading && !cvData) return <div>Loading...</div>
    if (!cvData) return <div>{error || 'Lỗi khi tải dữ liệu CV.'}</div>

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
                            <h2 className="text-xl font-bold mb-4">{UI_MESSAGES.CV_GENERATOR.FORM_TITLE}</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input value={cvData.personalDetails.fullName} onChange={e => handleInputChange('personalDetails', 'fullName', e.target.value)} placeholder="Họ và tên" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                                        <input value={cvData.personalDetails.jobTitle} onChange={e => handleInputChange('personalDetails', 'jobTitle', e.target.value)} placeholder="Chức danh" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                                        <input value={cvData.personalDetails.email} onChange={e => handleInputChange('personalDetails', 'email', e.target.value)} placeholder="Email" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                                        <input value={cvData.personalDetails.phoneNumber} onChange={e => handleInputChange('personalDetails', 'phoneNumber', e.target.value)} placeholder="Số điện thoại" className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                                        <input value={cvData.personalDetails.address} onChange={e => handleInputChange('personalDetails', 'address', e.target.value)} placeholder="Địa chỉ" className="p-2 border rounded col-span-2 dark:bg-slate-700 dark:border-slate-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Tóm tắt</h3>
                                    <textarea value={cvData.summary} onChange={e => setCVData({ ...cvData, summary: e.target.value })} placeholder="Viết tóm tắt về bản thân..." rows={4} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"></textarea>
                                    <button onClick={handleGenerateSummary} disabled={!!aiLoading} className="mt-2 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400">
                                        {aiLoading?.type === 'summary' ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                                        {UI_MESSAGES.CV_GENERATOR.AI_SUMMARY_BUTTON}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Kinh nghiệm làm việc</h3>
                                    {cvData.experience.map((exp, index) => (
                                        <div key={exp.id} className="p-4 border rounded mb-4 space-y-2 dark:border-slate-600">
                                            <input value={exp.jobTitle} onChange={e => handleArrayChange('experience', index, 'jobTitle', e.target.value)} placeholder="Chức danh" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                                            <input value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} placeholder="Công ty" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                                            <textarea value={exp.description} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} placeholder="Mô tả công việc..." rows={3} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"></textarea>
                                            <div className="flex justify-between items-center">
                                                <button onClick={() => handleEnhanceDescription('experience', index)} disabled={!!aiLoading} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400">
                                                    {aiLoading?.type === 'experience' && aiLoading?.index === index ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                                                    {UI_MESSAGES.CV_GENERATOR.AI_ENHANCE_BUTTON}
                                                </button>
                                                <button onClick={() => removeFromArray('experience', index)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => addToArray('experience')} className="flex items-center gap-2 text-sm text-indigo-600"><Plus className="w-4 h-4" />Thêm kinh nghiệm</button>
                                </div>
                            </div>
                        </div>
                        <div className="h-[75vh] rounded-lg shadow-md overflow-hidden">
                            <CVPreview cvData={cvData} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CVGeneratorPage;