import React from 'react';
import BackButton from './common/BackButton';
import { Building2 } from 'lucide-react';

interface UniversityExplorerProps {
    onBack: () => void;
}

const UniversityExplorer: React.FC<UniversityExplorerProps> = ({ onBack }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <BackButton onClick={onBack} />
            <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-lg shadow-lg">
                <Building2 className="w-20 h-20 mx-auto text-indigo-300 dark:text-indigo-600 mb-6" />
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Khám phá Trường Đại học</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                    Tính năng này đang được phát triển và sẽ sớm ra mắt!
                    <br />
                    Tại đây, bạn sẽ có thể tìm kiếm, lọc và so sánh các trường đại học để tìm ra nơi phù hợp nhất cho tương lai của mình.
                </p>
            </div>
        </div>
    );
};

export default UniversityExplorer;