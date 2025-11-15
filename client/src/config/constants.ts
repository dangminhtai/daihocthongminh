
import { Roadmap, Subject } from '../class/types';
import { Code, Briefcase, Palette } from 'lucide-react';

export const ROADMAPS: Roadmap[] = [
  {
    id: 'tech',
    name: 'Công nghệ & Kỹ thuật',
    description: 'Dành cho những người đam mê sáng tạo công nghệ, giải quyết vấn đề bằng logic và thuật toán.',
    icon: Code,
  },
  {
    id: 'business',
    name: 'Kinh doanh & Quản lý',
    description: 'Phù hợp với những ai có tư duy chiến lược, kỹ năng lãnh đạo và mong muốn phát triển kinh tế.',
    icon: Briefcase,
  },
  {
    id: 'arts',
    name: 'Nghệ thuật & Nhân văn',
    description: 'Con đường cho các tâm hồn sáng tạo, yêu cái đẹp, và muốn khám phá văn hóa, xã hội con người.',
    icon: Palette,
  },
];

export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Toán cao cấp' },
  { id: 'physics', name: 'Vật lý đại cương' },
  { id: 'oop', name: 'Lập trình hướng đối tượng' },
  { id: 'data_structures', name: 'Cấu trúc dữ liệu & Giải thuật' },
  { id: 'microeconomics', name: 'Kinh tế vi mô' },
  { id: 'marketing', name: 'Marketing căn bản' },
  { id: 'psychology', name: 'Tâm lý học đại cương' },
  { id: 'philosophy', name: 'Triết học Mác-Lênin' },
  { id: 'literature', name: 'Văn học Việt Nam hiện đại' },
  { id: 'biology', name: 'Sinh học phân tử' },
  { id: 'chemistry', name: 'Hóa học hữu cơ' },
  { id: 'law', name: 'Pháp luật đại cương' },
];
