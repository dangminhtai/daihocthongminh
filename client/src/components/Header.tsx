
import React from 'react';
import { UI_MESSAGES } from '../config/ui';
import { GraduationCap } from 'lucide-react';
import UserProfile from './UserProfile';
import { IUser } from '../class/types';

interface HeaderProps {
  onLogout: () => void;
  currentUser: IUser | null;
}

const Header: React.FC<HeaderProps> = ({ onLogout, currentUser }) => {
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
          {currentUser && <UserProfile user={currentUser} onLogout={onLogout} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
