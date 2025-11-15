
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mb-6 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Quay lại
  </button>
);

export default BackButton;
