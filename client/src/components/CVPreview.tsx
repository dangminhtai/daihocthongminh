
import React from 'react';
import { CVData } from '../class/types';
import { Mail, Phone, MapPin, Linkedin, Link as LinkIcon, Calendar } from 'lucide-react';

interface CVPreviewProps {
    cvData: CVData;
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
    const { personalDetails, summary, education, experience, skills, projects } = cvData;

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
            {children}
        </div>
    );

    const InfoItem: React.FC<{ icon: React.ReactNode; text?: string }> = ({ icon, text }) => (
        text ? <div className="flex items-center text-sm text-gray-600"><div className="mr-2">{icon}</div> {text}</div> : null
    );

    return (
        <div id="cv-preview-for-export" className="bg-white p-8 rounded-lg shadow-lg text-black w-full h-full overflow-y-auto">
            {/* Header */}
            <header className="flex items-center mb-8">
                {personalDetails.avatarUrl && <img src={personalDetails.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mr-6 object-cover" />}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{personalDetails.fullName}</h1>
                    <p className="text-lg text-indigo-600 font-semibold">{personalDetails.jobTitle}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <InfoItem icon={<Mail size={14} />} text={personalDetails.email} />
                        <InfoItem icon={<Phone size={14} />} text={personalDetails.phoneNumber} />
                        <InfoItem icon={<MapPin size={14} />} text={personalDetails.address} />
                    </div>
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <Section title="Tóm tắt">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
                </Section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <Section title="Kinh nghiệm làm việc">
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-800">{exp.jobTitle}</h3>
                                <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Hiện tại'}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                            <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </Section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <Section title="Học vấn">
                    {education.map(edu => (
                        <div key={edu.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-800">{edu.school}</h3>
                                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{edu.degree}{edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}</p>
                            <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{edu.description}</p>
                        </div>
                    ))}
                </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <Section title="Kỹ năng">
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill.id} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">{skill.skillName}</span>
                        ))}
                    </div>
                </Section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <Section title="Dự án">
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-4">
                            <div className="flex items-baseline">
                                <h3 className="font-bold text-gray-800">{proj.projectName}</h3>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-500 hover:underline"><LinkIcon size={12} /></a>}
                            </div>
                            <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{proj.description}</p>
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
};

export default CVPreview;