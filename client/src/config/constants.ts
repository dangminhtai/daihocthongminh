
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
export const QUIZ_DATA: Record<string, QuizQuestion> = {
  start: {
    question: 'Bạn thích dành thời gian rảnh để làm gì nhất?',
    options: [
      { text: 'Tìm hiểu, đọc sách, giải đố', nextQuestion: 'q_thinking', payload: 'thích tìm tòi, nghiên cứu' },
      { text: 'Sáng tạo, vẽ, viết, hoặc chơi nhạc', nextQuestion: 'q_creative', payload: 'có thiên hướng nghệ thuật, sáng tạo' },
      { text: 'Lắp ráp, sửa chữa đồ đạc, hoặc chơi thể thao', nextQuestion: 'q_practical', payload: 'thích các hoạt động thực tế, thể chất' },
      { text: 'Trò chuyện, giúp đỡ, hoặc tổ chức sự kiện cho bạn bè', nextQuestion: 'q_social', payload: 'có thiên hướng xã hội, thích tương tác' },
    ],
  },
  q_thinking: {
    question: 'Khi giải quyết vấn đề, bạn có xu hướng nào?',
    options: [
      { text: 'Dựa trên logic, số liệu và các quy tắc rõ ràng', nextQuestion: 'q_logic', payload: 'thiên về tư duy logic, phân tích' },
      { text: 'Tìm kiếm các ý tưởng mới, các khả năng trừu tượng', nextQuestion: 'q_abstract', payload: 'thiên về tư duy trừu tượng, khái niệm' },
      { text: 'Khác', nextQuestion: null, payload: 'có cách tiếp cận vấn đề khác', requiresInput: true },
    ],
  },
  q_creative: {
    question: 'Bạn thể hiện sự sáng tạo của mình tốt nhất qua hình thức nào?',
    options: [
      { text: 'Hình ảnh, màu sắc (hội họa, thiết kế)', nextQuestion: 'q_visual', payload: 'sáng tạo qua hình ảnh' },
      { text: 'Ngôn từ (viết lách, kể chuyện)', nextQuestion: 'q_verbal', payload: 'sáng tạo qua ngôn từ' },
      { text: 'Âm thanh, giai điệu (âm nhạc)', nextQuestion: null, payload: 'sáng tạo qua âm nhạc' },
      { text: 'Khác', nextQuestion: null, payload: 'sáng tạo qua hình thức khác', requiresInput: true },
    ],
  },
  q_practical: {
    question: 'Bạn cảm thấy hứng thú hơn với việc nào?',
    options: [
      { text: 'Làm việc với máy móc, công cụ', nextQuestion: 'q_machines', payload: 'thích làm việc với máy móc' },
      { text: 'Làm việc với cây cối, động vật, ngoài trời', nextQuestion: null, payload: 'thích làm việc với thiên nhiên' },
      { text: 'Vận động cơ thể, thể dục thể thao', nextQuestion: null, payload: 'thích vận động thể chất' },
    ],
  },
  q_social: {
    question: 'Trong một nhóm, vai trò của bạn thường là gì?',
    options: [
      { text: 'Người lãnh đạo, đưa ra quyết định', nextQuestion: 'q_leader', payload: 'có tố chất lãnh đạo' },
      { text: 'Người kết nối, hòa giải', nextQuestion: null, payload: 'có khả năng kết nối, hòa giải' },
      { text: 'Người hỗ trợ, chăm sóc người khác', nextQuestion: 'q_support', payload: 'thích hỗ trợ, chăm sóc' },
    ],
  },
  q_logic: {
    question: 'Bạn có thích làm việc với các hệ thống phức tạp không?',
    options: [
      { text: 'Có, tôi thích phân tích và tối ưu chúng', nextQuestion: null, payload: 'thích phân tích hệ thống phức tạp' },
      { text: 'Không, tôi thích những thứ đơn giản, rõ ràng', nextQuestion: null, payload: 'thích sự đơn giản, rõ ràng' },
    ],
  },
  q_abstract: {
    question: 'Bạn có hứng thú với việc nghiên cứu các lý thuyết khoa học hoặc triết học không?',
    options: [
      { text: 'Rất hứng thú', nextQuestion: null, payload: 'đam mê nghiên cứu lý thuyết' },
      { text: 'Không hẳn, tôi thích ứng dụng hơn', nextQuestion: null, payload: 'thiên về ứng dụng thực tế hơn là lý thuyết' },
    ]
  },
  q_visual: {
    question: 'Bạn thích sáng tạo trên nền tảng kỹ thuật số hay truyền thống?',
    options: [
      { text: 'Kỹ thuật số (máy tính, bảng vẽ điện tử)', nextQuestion: null, payload: 'sáng tạo trên nền tảng số' },
      { text: 'Truyền thống (giấy, màu vẽ)', nextQuestion: null, payload: 'sáng tạo trên chất liệu truyền thống' },
    ]
  },
  q_verbal: {
    question: 'Bạn muốn truyền tải thông điệp tới ai?',
    options: [
      { text: 'Số đông, công chúng', nextQuestion: null, payload: 'muốn truyền tải thông điệp cho công chúng' },
      { text: 'Một nhóm đối tượng cụ thể', nextQuestion: null, payload: 'muốn làm việc với một nhóm đối tượng cụ thể' },
    ]
  },
  q_machines: {
    question: 'Bạn thích tự tay chế tạo ra thứ gì đó mới hay vận hành những máy móc có sẵn?',
    options: [
      { text: 'Chế tạo thứ mới', nextQuestion: null, payload: 'thích chế tạo, phát minh' },
      { text: 'Vận hành, điều khiển', nextQuestion: null, payload: 'thích vận hành, điều khiển' },
    ]
  },
  q_leader: {
    question: 'Bạn có sẵn sàng chịu trách nhiệm cho kết quả của cả một tập thể không?',
    options: [
      { text: 'Chắc chắn rồi', nextQuestion: null, payload: 'sẵn sàng chịu trách nhiệm cao' },
      { text: 'Tôi còn phải cân nhắc', nextQuestion: null, payload: 'cẩn trọng với trách nhiệm lớn' },
    ]
  }
};
