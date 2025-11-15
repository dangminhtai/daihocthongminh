
import React from 'react';
import { UI_MESSAGES } from '../config/ui';
import { GraduationCap } from 'lucide-react';
import UserProfile from './UserProfile';
import { IUser } from '../class/types';
import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
  currentUser: IUser | null;
}

const Header: React.FC<HeaderProps> = ({ onLogout, currentUser }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${isActive
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/home" className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight hidden sm:block">
              {UI_MESSAGES.HEADER.TITLE}<span className="text-indigo-600 dark:text-indigo-400">{UI_MESSAGES.HEADER.TITLE_HIGHLIGHT}</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/home" className={navLinkClass}>
            Trang chủ
          </NavLink>
          <NavLink to="/cv-generator" className={navLinkClass}>
            Tạo CV
          </NavLink>
          <NavLink to="/docs" className={navLinkClass}>
            Tài liệu
          </NavLink>
          <NavLink to="/rating" className={navLinkClass}>
            Đánh giá
          </NavLink>
        </nav>

        <div className="flex-shrink-0">
          {currentUser && <UserProfile user={currentUser} onLogout={onLogout} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
