import React from 'react';
import { View } from '../class/types';
import { UI_MESSAGES } from '../config/ui';
import { Map, Compass, Rocket, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import DidYouKnow from './common/DidYouKnow';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      },
    }),
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Chào mừng bạn đến với <span className="text-indigo-600">Đại học Thông minh</span>
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-slate-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Trợ lý AI cá nhân giúp bạn khám phá con đường học tập và sự nghiệp phù hợp nhất với bản thân. Hãy bắt đầu hành trình của bạn!
        </motion.p>
      </div>

      {/* Main CTA Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onClick={() => onNavigate('roadmap')}
          className="group relative p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-indigo-500 overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-5">
              <Map className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{UI_MESSAGES.HOME.NO_MAJOR_TITLE}</h3>
            <p className="mt-2 text-base text-slate-600">
              {UI_MESSAGES.HOME.NO_MAJOR_DESCRIPTION}
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 text-indigo-100/50 group-hover:text-indigo-200/60 transition-colors duration-300 z-0">
            <Map size={120} strokeWidth={1} />
          </div>
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onClick={() => onNavigate('careerPath')}
          className="group relative p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500 overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-5">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{UI_MESSAGES.HOME.HAS_MAJOR_TITLE}</h3>
            <p className="mt-2 text-base text-slate-600">
              {UI_MESSAGES.HOME.HAS_MAJOR_DESCRIPTION}
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 text-green-100/50 group-hover:text-green-200/60 transition-colors duration-300 z-0">
            <Compass size={120} strokeWidth={1} />
          </div>
        </motion.div>
      </div>

      {/* Additional Features Section */}
      <div>
        <motion.h3
          className="text-3xl font-bold text-slate-800 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Khám phá thêm
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow"
          >
            <div>
              <div className="flex items-center mb-3">
                <Rocket className="h-6 w-6 text-red-500 mr-3" />
                <h4 className="font-bold text-lg text-slate-800">Ngành học nổi bật</h4>
              </div>
              <p className="text-sm text-slate-600 mb-4">Khám phá lộ trình cho ngành <span className="font-semibold">Công nghệ thông tin</span> - một trong những ngành hot nhất hiện nay.</p>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="w-full mt-auto text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-2 rounded-md bg-indigo-50 hover:bg-indigo-100"
            >
              Xem chi tiết →
            </button>
          </motion.div>

          <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
            <DidYouKnow />
          </motion.div>

          <motion.div
            custom={4}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow"
          >
            <div>
              <div className="flex items-center mb-3">
                <MessageSquare className="h-6 w-6 text-blue-500 mr-3" />
                <h4 className="font-bold text-lg text-slate-800">Tư vấn trực tiếp</h4>
              </div>
              <p className="text-sm text-slate-600 mb-4">Có câu hỏi cụ thể? Trò chuyện trực tiếp với trợ lý AI để được giải đáp và tư vấn sâu hơn.</p>
            </div>
            <p className="text-xs text-center text-slate-400 mt-4">
              Nhấp vào bong bóng chat ở góc dưới bên phải để bắt đầu!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
