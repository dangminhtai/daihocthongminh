
import React from 'react';
import { View } from '../class/types';
import { UI_MESSAGES } from '../config/ui';
import { Map, Compass } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{UI_MESSAGES.HOME.WELCOME_TITLE}</h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
        {UI_MESSAGES.HOME.WELCOME_DESCRIPTION}
      </p>
      <p className="mt-2 max-w-2xl mx-auto text-lg text-slate-600">
        {UI_MESSAGES.HOME.USER_QUESTION}
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          onClick={() => onNavigate('roadmap')}
          className="group relative p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-indigo-500"
        >
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600">
              <Map className="h-8 w-8" />
            </div>
          </div>
          <h3 className="mt-6 text-xl font-bold text-slate-900">{UI_MESSAGES.HOME.NO_MAJOR_TITLE}</h3>
          <p className="mt-2 text-base text-slate-600">
            {UI_MESSAGES.HOME.NO_MAJOR_DESCRIPTION}
          </p>
          <span className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {UI_MESSAGES.HOME.START_ACTION}
          </span>
        </div>

        <div
          onClick={() => onNavigate('careerPath')}
          className="group relative p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-indigo-500"
        >
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600">
              <Compass className="h-8 w-8" />
            </div>
          </div>
          <h3 className="mt-6 text-xl font-bold text-slate-900">{UI_MESSAGES.HOME.HAS_MAJOR_TITLE}</h3>
          <p className="mt-2 text-base text-slate-600">
            {UI_MESSAGES.HOME.HAS_MAJOR_DESCRIPTION}
          </p>
          <span className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {UI_MESSAGES.HOME.EXPLORE_ACTION}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
