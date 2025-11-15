import React from 'react';
import { View } from '../class/types';
import { UI_MESSAGES } from '../config/ui';
import { Map, Compass, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import DidYouKnow from './common/DidYouKnow';

interface HomeProps {
  onNavigate: (view: View, payload?: any) => void;
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
          className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Chào mừng đến với <span className="text-indigo-600 dark:text-indigo-400">Đại học Thông minh</span>
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Trợ lý AI cá nhân giúp bạn khám phá con đường học tập và sự nghiệp phù hợp nhất. Hãy bắt đầu hành trình của bạn!
        </motion.p>
      </div>

      {/* Main CTA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card 1: Quiz */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onClick={() => onNavigate('quiz')}
          className="group relative col-span-1 lg:col-span-2 p-8 bg-indigo-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/20 text-white mb-5">
              <Rocket className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">{UI_MESSAGES.HOME.QUIZ_TITLE}</h3>
            <p className="mt-2 text-base text-indigo-100 max-w-lg">
              {UI_MESSAGES.HOME.QUIZ_DESCRIPTION}
            </p>
          </div>
          <div className="absolute -bottom-12 -right-12 text-white/10 group-hover:text-white/20 transition-colors duration-300 z-0">
            <Rocket size={150} strokeWidth={1} />
          </div>
        </motion.div>

        {/* Card 2: Did you know */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <DidYouKnow />
        </motion.div>
      </div>

      {/* Secondary Actions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onClick={() => onNavigate('roadmap')}
          className="group relative p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
              <Map className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{UI_MESSAGES.HOME.ROADMAP_TITLE}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{UI_MESSAGES.HOME.ROADMAP_DESCRIPTION}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onClick={() => onNavigate('careerPath')}
          className="group relative p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-green-500"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
              <Compass className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{UI_MESSAGES.HOME.SUBJECTS_TITLE}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{UI_MESSAGES.HOME.SUBJECTS_DESCRIPTION}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;