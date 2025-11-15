
import React from 'react';

interface InputProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ id, label, type, placeholder, value, onChange, icon }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {label}
            </label>
            <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    {icon}
                </div>
                <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                    className="block w-full border-0 border-b-2 border-gray-200 bg-transparent py-2.5 pl-10 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:border-gray-600 focus:ring-0 focus:border-purple-500 dark:focus:border-purple-400 sm:text-sm sm:leading-6 transition-colors"
                />
            </div>
        </div>
    );
};

export default Input;
