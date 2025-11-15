
import React, { useState, useCallback, useEffect } from 'react';
import { ROADMAPS } from '../config/constants';
import { Roadmap as RoadmapType, MajorSuggestion, MajorDetails } from '../class/types';
import { suggestMajorsForRoadmap, getMajorDetails } from '../services/geminiService';
import { ERROR_MESSAGES } from '../config/errors';
import { UI_MESSAGES } from '../config/ui';
import LoadingSpinner from './common/LoadingSpinner';
import BackButton from './common/BackButton';
import { CheckCircle, Zap, ChevronRight, Target, BookOpen, Star, GraduationCap, Briefcase } from 'lucide-react';

interface RoadmapSelectorProps {
  onBack: () => void;
  preselectedRoadmapId?: string;
}

const RoadmapSelector: React.FC<RoadmapSelectorProps> = ({ onBack, preselectedRoadmapId }) => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapType | null>(null);
  const [suggestions, setSuggestions] = useState<MajorSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectingMajor, setInspectingMajor] = useState<MajorSuggestion | null>(null);
  const [majorDetails, setMajorDetails] = useState<MajorDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

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

  useEffect(() => {
    if (preselectedRoadmapId) {
      const roadmapToSelect = ROADMAPS.find(r => r.id === preselectedRoadmapId);
      if (roadmapToSelect) {
        handleSelectRoadmap(roadmapToSelect);
      }
    }
  }, [preselectedRoadmapId, handleSelectRoadmap]);

  const handleSelectMajor = useCallback(async (major: MajorSuggestion) => {
    setInspectingMajor(major);
    setIsDetailsLoading(true);
    setError(null);
    setMajorDetails(null);
    try {
      const result = await getMajorDetails(major.majorName);
      setMajorDetails(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setIsDetailsLoading(false);
    }
  }, []);

  const resetSelection = () => {
    if (preselectedRoadmapId) {
      onBack();
    } else {
      setSelectedRoadmap(null);
      setSuggestions([]);
      setError(null);
    }
  };

  const backToSuggestions = () => {
    setInspectingMajor(null);
    setMajorDetails(null);
    setError(null);
  };

  if (inspectingMajor) {
    return (
      <div>
        <BackButton onClick={backToSuggestions} />
        <h2 className="text-3xl font-bold text-center mb-2">{inspectingMajor.majorName}</h2>
        <p className="text-indigo-600 font-semibold text-center text-lg mb-8">{selectedRoadmap?.name}</p>

        {isDetailsLoading && <LoadingSpinner />}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

        {!isDetailsLoading && !error && majorDetails && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in">
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-3">
                <Target className="h-6 w-6 mr-3 text-indigo-500 flex-shrink-0" />
                Mục tiêu đào tạo
              </h3>
              <p className="text-slate-600 leading-relaxed">{majorDetails.trainingObjectives}</p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-4">
                <BookOpen className="h-6 w-6 mr-3 text-indigo-500 flex-shrink-0" />
                Các môn học tiêu biểu
              </h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Môn học cốt lõi
                  </h4>
                  <ul className="space-y-2">
                    {majorDetails.mainSubjects.map((subject, i) => (
                      <li key={i} className="flex items-start text-slate-600">
                        <ChevronRight className="h-5 w-5 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{subject}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-gray-400" />
                    Môn học tự chọn
                  </h4>
                  <ul className="space-y-2">
                    {majorDetails.electiveSubjects.map((subject, i) => (
                      <li key={i} className="flex items-start text-slate-600">
                        <ChevronRight className="h-5 w-5 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span>{subject}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-3">
                <GraduationCap className="h-6 w-6 mr-3 text-indigo-500 flex-shrink-0" />
                Lộ trình học tập
              </h3>
              <ul className="space-y-3">
                {majorDetails.curriculumRoadmap.map((item, i) => (
                  <li key={i} className="flex items-start text-slate-600">
                    <ChevronRight className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-700 mr-2">{item.split(':')[0]}:</span>
                    <span>{item.split(':').slice(1).join(':').trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-3">
                <Briefcase className="h-6 w-6 mr-3 text-indigo-500 flex-shrink-0" />
                Định hướng nghề nghiệp
              </h3>
              <ul className="space-y-2">
                {majorDetails.careerOrientations.map((career, i) => (
                  <li key={i} className="flex items-start text-slate-600">
                    <ChevronRight className="h-5 w-5 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{career}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

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
              <div
                key={index}
                onClick={() => handleSelectMajor(suggestion)}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:border-indigo-600 transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      {suggestion.majorName}
                    </h3>
                    <p className="mt-2 text-slate-600">{suggestion.description}</p>
                  </div>
                  <ChevronRight className="h-8 w-8 text-indigo-300 group-hover:text-indigo-500 transition-colors ml-4 flex-shrink-0" />
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-slate-700">{UI_MESSAGES.ROADMAP_SELECTOR.CORE_SKILLS_LABEL}</h4>
                  <ul className="mt-2 space-y-1">
                    {suggestion.coreSkills.map((skill, i) => (
                      <li key={i} className="flex items-center text-slate-600 text-sm">
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
