
import React, { useState, useCallback } from 'react';
import { ROADMAPS } from '../config/constants';
import { Roadmap as RoadmapType, MajorSuggestion } from '../class/types';
import { suggestMajorsForRoadmap } from '../services/geminiService';
import { ERROR_MESSAGES } from '../config/errors';
import { UI_MESSAGES } from '../config/ui';
import LoadingSpinner from './common/LoadingSpinner';
import BackButton from './common/BackButton';
import { CheckCircle, Zap } from 'lucide-react';

interface RoadmapSelectorProps {
  onBack: () => void;
}

const RoadmapSelector: React.FC<RoadmapSelectorProps> = ({ onBack }) => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapType | null>(null);
  const [suggestions, setSuggestions] = useState<MajorSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRoadmap = useCallback(async (roadmap: RoadmapType) => {
    setSelectedRoadmap(roadmap);
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await suggestMajorsForRoadmap(roadmap.name);
      setSuggestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetSelection = () => {
    setSelectedRoadmap(null);
    setSuggestions([]);
    setError(null);
  };

  if (selectedRoadmap) {
    return (
      <div>
        <BackButton onClick={resetSelection} />
        <h2 className="text-2xl font-bold text-center mb-2">{UI_MESSAGES.ROADMAP_SELECTOR.RESULT_TITLE}</h2>
        <p className="text-indigo-600 font-semibold text-center text-lg mb-8">{selectedRoadmap.name}</p>

        {isLoading && <LoadingSpinner />}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

        {!isLoading && !error && (
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 transition-transform transform hover:scale-105 duration-300">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  {suggestion.majorName}
                </h3>
                <p className="mt-2 text-slate-600">{suggestion.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-slate-700">{UI_MESSAGES.ROADMAP_SELECTOR.CORE_SKILLS_LABEL}</h4>
                  <ul className="mt-2 space-y-1">
                    {suggestion.coreSkills.map((skill, i) => (
                      <li key={i} className="flex items-center text-slate-600">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <BackButton onClick={onBack} />
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{UI_MESSAGES.ROADMAP_SELECTOR.TITLE}</h2>
        <p className="mt-2 text-slate-600">{UI_MESSAGES.ROADMAP_SELECTOR.DESCRIPTION}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROADMAPS.map((roadmap) => (
          <div
            key={roadmap.id}
            onClick={() => handleSelectRoadmap(roadmap)}
            className="group p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-center transform hover:-translate-y-1 border-b-4 border-transparent hover:border-indigo-500"
          >
            <roadmap.icon className="h-12 w-12 mx-auto text-indigo-600" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{roadmap.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{roadmap.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapSelector;
