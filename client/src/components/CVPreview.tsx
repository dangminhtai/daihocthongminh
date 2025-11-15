import React from 'react';
import { CVData } from '../class/types';
import { Mail, Phone, MapPin, Edit } from 'lucide-react';

interface CVPreviewProps {
    cvData: CVData;
    onFocusField: (fieldId: string) => void;
    onEditAvatar: () => void;
}

// --- Reusable Sub-components ---

const EditableField: React.FC<{ fieldId: string; onFocus: (id: string) => void; children: React.ReactNode; className?: string; as?: keyof JSX.IntrinsicElements }> =
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

const Section: React.FC<{ title: string; children: React.ReactNode; isModern?: boolean }> = ({ title, children, isModern }) => (
    <div className="mb-6 break-inside-avoid">
        <h2 className={`font-bold pb-1 mb-3 ${isModern ? 'text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-400' : 'text-xl text-gray-800 dark:text-slate-200 border-b-2 border-gray-300 dark:border-slate-600'}`}>{title}</h2>
        {children}
    </div>
);

const SummarySection: React.FC<Pick<CVPreviewProps, 'cvData' | 'onFocusField'>> = ({ cvData, onFocusField }) => (
    <Section title="Tóm tắt">
        <EditableField fieldId="summary" onFocus={onFocusField} as="p" className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {cvData.summary}
        </EditableField>
    </Section>
);

const ExperienceSection: React.FC<Pick<CVPreviewProps, 'cvData' | 'onFocusField'>> = ({ cvData, onFocusField }) => (
    <Section title="Kinh nghiệm làm việc">
        {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                    <EditableField fieldId={`experience.${index}.jobTitle`} onFocus={onFocusField} as="h3" className="font-bold text-gray-800 dark:text-slate-200">
                        {exp.jobTitle || "Chức danh"}
                    </EditableField>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{exp.startDate} - {exp.endDate || 'Hiện tại'}</p>
                </div>
                <EditableField fieldId={`experience.${index}.company`} onFocus={onFocusField} as="p" className="text-sm font-semibold text-gray-700 dark:text-slate-300 italic">
                    {exp.company || "Công ty"}
                </EditableField>
                <EditableField fieldId={`experience.${index}.description`} onFocus={onFocusField} as="p" className="mt-1 text-sm text-gray-600 dark:text-slate-400 whitespace-pre-wrap">
                    {exp.description || "Mô tả công việc..."}
                </EditableField>
            </div>
        ))}
    </Section>
);

const EducationSection: React.FC<Pick<CVPreviewProps, 'cvData' | 'onFocusField'>> = ({ cvData, onFocusField }) => (
    <Section title="Học vấn">
        {cvData.education.map((edu, index) => (
            <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                    <EditableField fieldId={`education.${index}.school`} onFocus={onFocusField} as="h3" className="font-bold text-gray-800 dark:text-slate-200">
                        {edu.school || "Tên trường"}
                    </EditableField>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{edu.startDate} - {edu.endDate}</p>
                </div>
                <EditableField fieldId={`education.${index}.degree`} onFocus={onFocusField} as="p" className="text-sm font-semibold text-gray-700 dark:text-slate-300 italic">
                    {edu.degree}{edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}
                </EditableField>
            </div>
        ))}
    </Section>
);

const ProjectsSection: React.FC<Pick<CVPreviewProps, 'cvData' | 'onFocusField'>> = ({ cvData, onFocusField }) => (
    <Section title="Dự án">
        {cvData.projects.map((proj, index) => (
            <div key={proj.id} className="mb-4">
                <EditableField fieldId={`projects.${index}.projectName`} onFocus={onFocusField} as="h3" className="font-bold text-gray-800 dark:text-slate-200">
                    {proj.projectName || "Tên dự án"}
                </EditableField>
                <EditableField fieldId={`projects.${index}.description`} onFocus={onFocusField} as="p" className="mt-1 text-sm text-gray-600 dark:text-slate-400 whitespace-pre-wrap">
                    {proj.description || "Mô tả dự án..."}
                </EditableField>
            </div>
        ))}
    </Section>
);

const SkillsSection: React.FC<Pick<CVPreviewProps, 'cvData' | 'onFocusField'>> = ({ cvData, onFocusField }) => (
    <Section title="Kỹ năng">
        <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
                <EditableField key={skill.id} fieldId={`skills.${index}.skillName`} onFocus={onFocusField}>
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-medium px-3 py-1 rounded-full">{skill.skillName || "Kỹ năng"}</span>
                </EditableField>
            ))}
        </div>
    </Section>
);

const componentMap: { [key: string]: React.FC<any> } = {
    summary: SummarySection,
    experience: ExperienceSection,
    education: EducationSection,
    projects: ProjectsSection,
    skills: SkillsSection,
};

const CVPreview: React.FC<CVPreviewProps> = (props) => {
    const { cvData, onFocusField, onEditAvatar } = props;

    // Defensive check to prevent crash if cvData or cvData.template is not ready
    if (!cvData || !cvData.template) {
        return (
            <div id="cv-preview-for-export" className="bg-white dark:bg-slate-800 w-full h-full flex items-center justify-center p-8">
                <p className="text-slate-500 text-center">Đang tải dữ liệu mẫu CV...<br />Nếu lỗi vẫn tiếp diễn, vui lòng thử chọn một mẫu khác.</p>
            </div>
        );
    }

    const { personalDetails } = cvData;
    const { structure } = cvData.template;

    const renderSections = (sectionNames: string[]) => {
        return sectionNames.map(sectionName => {
            const Component = componentMap[sectionName];
            return Component ? <Component key={sectionName} {...props} /> : null;
        });
    };

    if (structure.layout === 'modern') {
        // MODERN TEMPLATE (TWO-COLUMN)
        const sidebarSections = ['skills']; // Define sections for the sidebar
        const mainSections = structure.sectionOrder.filter(s => !sidebarSections.includes(s));

        return (
            <div id="cv-preview-for-export" className="bg-white dark:bg-slate-800 w-full h-full overflow-y-auto font-sans text-sm flex">
                <aside className="w-1/3 bg-slate-50 dark:bg-slate-800/50 p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer mb-4" onClick={onEditAvatar}>
                            <img src={personalDetails.avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity"><Edit className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" /></div>
                        </div>
                        <EditableField fieldId="personalDetails.fullName" onFocus={onFocusField} as="h1" className="text-2xl font-bold text-gray-900 dark:text-slate-50">{personalDetails.fullName || "Họ và Tên"}</EditableField>
                        <EditableField fieldId="personalDetails.jobTitle" onFocus={onFocusField} as="p" className="text-md text-indigo-600 dark:text-indigo-400 font-semibold">{personalDetails.jobTitle || "Chức danh"}</EditableField>
                    </div>
                    <div className="mt-8 space-y-4">
                        <EditableField fieldId="personalDetails.email" onFocus={onFocusField} className="flex items-start text-gray-700 dark:text-slate-200"><Mail size={14} className="mr-2 mt-0.5 flex-shrink-0" /><span>{personalDetails.email}</span></EditableField>
                        <EditableField fieldId="personalDetails.phoneNumber" onFocus={onFocusField} className="flex items-start text-gray-700 dark:text-slate-200"><Phone size={14} className="mr-2 mt-0.5 flex-shrink-0" /><span>{personalDetails.phoneNumber}</span></EditableField>
                        <EditableField fieldId="personalDetails.address" onFocus={onFocusField} className="flex items-start text-gray-700 dark:text-slate-200"><MapPin size={14} className="mr-2 mt-0.5 flex-shrink-0" /><span>{personalDetails.address}</span></EditableField>
                    </div>
                    <div className="mt-8">{renderSections(sidebarSections)}</div>
                </aside>
                <main className="w-2/3 p-8">
                    {renderSections(mainSections)}
                </main>
            </div>
        );
    }

    // CLASSIC TEMPLATE (ONE-COLUMN)
    return (
        <div id="cv-preview-for-export" className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full h-full overflow-y-auto font-sans">
            <header className="flex items-center mb-8">
                <div className="relative group cursor-pointer mr-6" onClick={onEditAvatar}>
                    <img src={personalDetails.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-slate-700" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity"><Edit className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" /></div>
                </div>
                <div>
                    <EditableField fieldId="personalDetails.fullName" onFocus={onFocusField} as="h1" className="text-3xl font-bold text-gray-900 dark:text-slate-50">{personalDetails.fullName || "Họ và Tên"}</EditableField>
                    <EditableField fieldId="personalDetails.jobTitle" onFocus={onFocusField} as="p" className="text-lg text-indigo-600 dark:text-indigo-400 font-semibold">{personalDetails.jobTitle || "Chức danh"}</EditableField>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {personalDetails.email && <EditableField fieldId="personalDetails.email" onFocus={onFocusField} className="flex items-center text-sm text-gray-600 dark:text-slate-300"><Mail size={14} className="mr-2" />{personalDetails.email}</EditableField>}
                        {personalDetails.phoneNumber && <EditableField fieldId="personalDetails.phoneNumber" onFocus={onFocusField} className="flex items-center text-sm text-gray-600 dark:text-slate-300"><Phone size={14} className="mr-2" />{personalDetails.phoneNumber}</EditableField>}
                        {personalDetails.address && <EditableField fieldId="personalDetails.address" onFocus={onFocusField} className="flex items-center text-sm text-gray-600 dark:text-slate-300"><MapPin size={14} className="mr-2" />{personalDetails.address}</EditableField>}
                    </div>
                </div>
            </header>
            {renderSections(structure.sectionOrder)}
        </div>
    );
};

export default CVPreview;