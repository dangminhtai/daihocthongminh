
import React from 'react';
import { CVTemplate } from '../../class/types';
import { UI_MESSAGES } from '../../config/ui';

interface TemplateSelectorProps {
    templates: CVTemplate[];
    currentTemplateId: string;
    onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, currentTemplateId, onSelectTemplate }) => {
    return (
        <div>
            <h3 className="font-semibold mb-3 dark:text-slate-300">{UI_MESSAGES.CV_GENERATOR.TEMPLATE_SECTION_TITLE}</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2">
                {templates.map(template => (
                    <div
                        key={template._id}
                        onClick={() => onSelectTemplate(template._id)}
                        className={`cursor-pointer group flex-shrink-0`}
                    >
                        <div
                            className={`w-28 h-40 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentTemplateId === template._id
                                    ? 'border-indigo-500 scale-105'
                                    : 'border-transparent hover:border-indigo-400'
                                }`}
                        >
                            <img
                                src={template.thumbnailUrl || `https://api.dicebear.com/8.x/shapes/svg?seed=${template.name}`}
                                alt={template.name}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <p className={`mt-2 text-sm text-center font-medium transition-colors ${currentTemplateId === template._id
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-600 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white'
                            }`}>
                            {template.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;