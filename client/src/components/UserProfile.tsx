import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings } from 'lucide-react';
import { IUser } from '../class/types';
import { Link } from 'react-router-dom';

interface UserProfileProps {
    user: IUser;
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuVariants = {
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
        closed: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: { duration: 0.15 },
        },
    };

    const MenuItem = ({ icon, text, onClick, className }: { icon: React.ReactNode; text: string; onClick?: () => void; className?: string }) => (
        <button
            onClick={onClick}
            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors ${className || ''}`}
        >
            {icon}
            {text}
        </button>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full transition-transform transform hover:scale-110"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="User menu"
            >
                <img
                    src={user.avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 origin-top-right overflow-hidden"
                    >
                        <div className="p-4 bg-gray-50/50">
                            <div className="flex items-center">
                                <img src={user.avatarUrl} alt="User Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div className="ml-4 overflow-hidden">
                                    <p className="font-bold text-gray-800 text-base truncate" title={user.fullName}>{user.fullName}</p>
                                    <p className="text-xs text-gray-500" title={user.userId}>
                                        #{user.userId}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 space-y-1">
                            <Link to="/profile" className="block">
                                <MenuItem icon={<User className="w-4 h-4 text-gray-500" />} text="Hồ sơ của bạn" />
                            </Link>
                            <MenuItem icon={<Settings className="w-4 h-4 text-gray-500" />} text="Cài đặt" />
                        </div>
                        <div className="border-t border-gray-100 my-1"></div>
                        <div className="p-2">
                            <MenuItem
                                icon={<LogOut className="w-4 h-4 text-red-500" />}
                                text="Đăng xuất"
                                onClick={onLogout}
                                className="text-red-600 hover:bg-red-50"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfile;
