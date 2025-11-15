
import React from 'react';

interface SocialButtonProps {
    bgColor: string;
    children: React.ReactNode;
    'aria-label': string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ bgColor, children, 'aria-label': ariaLabel }) => {
    return (
        <button
            aria-label={ariaLabel}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity ${bgColor}`}
        >
            {children}
        </button>
    );
};

export default SocialButton;
