
import { Roadmap, Subject } from '../class/types';
import { Code, Briefcase, Palette, Wrench, BookOpen, Newspaper } from 'lucide-react';

export const ROADMAPS: Roadmap[] = [
  {
    id: 'tech',
    name: 'Công nghệ thông tin',
    description: 'Dành cho những người đam mê sáng tạo công nghệ, giải quyết vấn đề bằng logic và thuật toán.',
    icon: Code,
  },
  {
    id: 'economy',
    name: 'Kinh tế',
    description: 'Phù hợp với những ai có tư duy chiến lược, kỹ năng lãnh đạo và mong muốn phát triển kinh tế.',
    icon: Briefcase,
  },
  {
    id: 'arts',
    name: 'Nghệ thuật & Nhân văn',
    description: 'Con đường cho các tâm hồn sáng tạo, yêu cái đẹp, và muốn khám phá văn hóa, xã hội con người.',
    icon: Palette,
  },
  {
    id: 'mechanical_engineering',
    name: 'Cơ khí động lực',
    description: 'Nghề dành cho những người đam mê thiết kế, cấu trúc máy móc và các hệ thống cơ khí.',
    icon: Wrench,
  },
  {
    id: 'foreign_language',
    name: 'Ngoại ngữ',
    description: 'Khoa dành cho những đối tượng muốn tìm hiểu thêm về ngôn ngữ và văn hóa của các quốc gia khác.',
    icon: BookOpen,
  },
  {
    id: 'journalism',
    name: 'Truyền thông',
    description: 'Khoa dành cho những đối tượng bắt kịp những tin tức mới nhất và luôn là người đầu tiên bắt gặp những sự kiện thú vị nhất.',
    icon: Newspaper,
  }
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
export const INITIAL_QUIZ_QUESTION: QuizQuestion = {
  question: 'Để bắt đầu, hãy cho tôi biết: Bạn bị thu hút bởi loại hoạt động nào nhất?',
  options: [
    'Làm việc với ý tưởng, dữ liệu và phân tích logic.',
    'Sáng tạo nghệ thuật, thiết kế hoặc thể hiện bản thân.',
    'Làm việc thực tế, thủ công, hoặc các hoạt động thể chất.',
    'Tương tác, giao tiếp và giúp đỡ mọi người.',
  ],
};