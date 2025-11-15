
import React from 'react';
import { UI_MESSAGES } from '../config/ui';
import { GraduationCap, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            {UI_MESSAGES.HEADER.TITLE}<span className="text-indigo-600">{UI_MESSAGES.HEADER.TITLE_HIGHLIGHT}</span>
          </h1>
        </div>
        <div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
