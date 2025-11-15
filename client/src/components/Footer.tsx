
import React from 'react';
import { UI_MESSAGES } from '../config/ui';

const Footer: React.FC = () => {
    return (
        <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800 mt-auto">
            <p>{UI_MESSAGES.FOOTER.COPYRIGHT}</p>
        </footer>
    );
};

export default Footer;
