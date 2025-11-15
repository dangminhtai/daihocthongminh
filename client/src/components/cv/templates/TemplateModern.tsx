
import React from 'react';
import { CVData } from '../../../class/types';
import { Mail, Phone, MapPin, Edit } from 'lucide-react';

interface CVPreviewProps {
    cvData: CVData;
    onFocusField: (fieldId: string) => void;
    onEditAvatar: () => void;
}

const EditableField: React.FC<{ fieldId: string; onFocus: (id: string) => void; children: React.ReactNode; className?: string; as?: 'h1' | 'p' | 'div' | 'h2' | 'h3' }> =
    ({ fieldId, onFocus, children, className, as = 'div' }) => {
        const Component = as;
        return (
            <Component
                onClick={() => onFocus(fieldId)}
                className={`cursor-pointer transition-colors duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 p-1 -m-1 rounded-md ${className}`}
            >
                {children}
            </Component>
        );
    };

const TemplateModern: React.FC<CVPreviewProps> = ({ cvData, onFocusField, onEditAvatar }) => {
    const { personalDetails, summary, education, experience, skills, projects } = cvData;

    const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
        <div className={`mb-6 ${className}`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1 mb-3">{title}</h2>
            {children}
        </div>
    );

    const InfoItem: React.FC<{ icon: React.ReactNode; text?: string, fieldId: string }> = ({ icon, text, fieldId }) => (
        text ? (
            <EditableField fieldId={fieldId} onFocus={onFocusField} as="div" className="flex items-start text-sm text-gray-700 dark:text-slate-200">
                <div className="mr-2 mt-0.5 flex-shrink-0">{icon}</div> <span>{text}</span>
            </EditableField>
        ) : null
    );

    return (
        <div id="cv-preview-for-export" className="bg-white dark:bg-slate-800 w-full h-full overflow-y-auto font-sans text-sm">
            <div className="flex">
                {/* Left Column */}
                <aside className="w-1/3 bg-slate-50 dark:bg-slate-800/50 p-6">
                    <div className="flex flex-col items-center text-center">
                        {personalDetails.avatarUrl && (
                            <div className="relative group cursor-pointer mb-4" onClick={onEditAvatar}>
                                <img src={personalDetails.avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity">
                                    <Edit className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        )}
                        <EditableField fieldId="personalDetails.fullName" onFocus={onFocusField} as="h1" className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                            {personalDetails.fullName || "Họ và Tên"}
                        </EditableField>
                        <EditableField fieldId="personalDetails.jobTitle" onFocus={onFocusField} as="p" className="text-md text-indigo-600 dark:text-indigo-400 font-semibold">
                            {personalDetails.jobTitle || "Chức danh"}
                        </EditableField>
                    </div>

                    <div className="mt-8 space-y-4">
                        <InfoItem icon={<Mail size={14} />} text={personalDetails.email} fieldId="personalDetails.email" />
                        <InfoItem icon={<Phone size={14} />} text={personalDetails.phoneNumber} fieldId="personalDetails.phoneNumber" />
                        <InfoItem icon={<MapPin size={14} />} text={personalDetails.address} fieldId="personalDetails.address" />
                    </div>

                    {skills.length > 0 && (
                        <Section title="Kỹ năng" className="mt-8">
                            <ul className="space-y-2">
                                {skills.map((skill, index) => (
                                    <EditableField key={skill.id} fieldId={`skills.${index}.skillName`} onFocus={onFocusField} as="li" className="text-gray-700 dark:text-slate-200">
                                        {skill.skillName || "Kỹ năng"}
                                    </EditableField>
                                ))}
                            </ul>
                        </Section>
                    )}
                </aside>

                {/* Right Column */}
                <main className="w-2/3 p-8">
                    {summary && (
                        <Section title="Tóm tắt">
                            <EditableField fieldId="summary" onFocus={onFocusField} as="p" className="text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {summary}
                            </EditableField>
                        </Section>
                    )}

                    {experience.length > 0 && (
                        <Section title="Kinh nghiệm làm việc">
                            {experience.map((exp, index) => (
                                <div key={exp.id} className="mb-4">
                                    <div className="flex justify-between items-baseline">
                                        <EditableField fieldId={`experience.${index}.jobTitle`} onFocus={onFocusField} as="h3" className="font-semibold text-gray-800 dark:text-slate-200">
                                            {exp.jobTitle || "Chức danh"}
                                        </EditableField>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">{exp.startDate} - {exp.endDate || 'Hiện tại'}</p>
                                    </div>
                                    <EditableField fieldId={`experience.${index}.company`} onFocus={onFocusField} as="p" className="text-sm text-gray-600 dark:text-slate-300 italic">
                                        {exp.company || "Công ty"}
                                    </EditableField>
                                    <EditableField fieldId={`experience.${index}.description`} onFocus={onFocusField} as="p" className="mt-1 text-sm text-gray-600 dark:text-slate-400 whitespace-pre-wrap">
                                        {exp.description || "Mô tả công việc..."}
                                    </EditableField>
                                </div>
                            ))}
                        </Section>
                    )}

                    {education.length > 0 && (
                        <Section title="Học vấn">
                            {education.map((edu, index) => (
                                <div key={edu.id} className="mb-4">
                                    <div className="flex justify-between items-baseline">
                                        <EditableField fieldId={`education.${index}.school`} onFocus={onFocusField} as="h3" className="font-semibold text-gray-800 dark:text-slate-200">
                                            {edu.school || "Tên trường"}
                                        </EditableField>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                    <EditableField fieldId={`education.${index}.degree`} onFocus={onFocusField} as="p" className="text-sm text-gray-600 dark:text-slate-300 italic">
                                        {edu.degree}{edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}
                                    </EditableField>
                                </div>
                            ))}
                        </Section>
                    )}

                    {projects.length > 0 && (
                        <Section title="Dự án">
                            {projects.map((proj, index) => (
                                <div key={proj.id} className="mb-4">
                                    <EditableField fieldId={`projects.${index}.projectName`} onFocus={onFocusField} as="h3" className="font-semibold text-gray-800 dark:text-slate-200">
                                        {proj.projectName || "Tên dự án"}
                                    </EditableField>
                                    <EditableField fieldId={`projects.${index}.description`} onFocus={onFocusField} as="p" className="mt-1 text-sm text-gray-600 dark:text-slate-400 whitespace-pre-wrap">
                                        {proj.description || "Mô tả dự án..."}
                                    </EditableField>
                                </div>
                            ))}
                        </Section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TemplateModern;
