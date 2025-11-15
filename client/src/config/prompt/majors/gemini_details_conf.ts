import { Type } from "@google/genai";

export const geminiMajorDetailsPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Cung cấp thông tin chi tiết về chuyên ngành đại học "{{majorName}}".
Thông tin cần bao gồm:
1.  Mục tiêu đào tạo: Mô tả chi tiết các kiến thức và kỹ năng sinh viên sẽ đạt được (khoảng 2-4 câu).
2.  Các môn học chính: Liệt kê 5-7 môn học cốt lõi, quan trọng nhất của chuyên ngành.
3.  Các môn học phụ (tự chọn): Liệt kê 3-5 môn học tự chọn tiêu biểu.
4.  Lộ trình học tập: Mô tả tóm tắt lộ trình qua các năm học (ví dụ: Năm 1 học gì, Năm 2 học gì...). Mỗi năm là một mục.
5.  Định hướng nghề nghiệp: Liệt kê 4-6 vị trí công việc, vai trò mà sinh viên có thể đảm nhận sau khi tốt nghiệp.
  `.trim(),
    resSchema: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                trainingObjectives: {
                    type: Type.STRING,
                    description: "Mô tả chi tiết mục tiêu đào tạo của chuyên ngành.",
                },
                mainSubjects: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Danh sách các môn học chính, cốt lõi.",
                },
                electiveSubjects: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Danh sách các môn học phụ hoặc tự chọn.",
                },
                curriculumRoadmap: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Mô tả lộ trình học tập qua các năm.",
                },
                careerOrientations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Danh sách các định hướng nghề nghiệp sau khi tốt nghiệp.",
                },
            },
            required: [
                "trainingObjectives",
                "mainSubjects",
                "electiveSubjects",
                "curriculumRoadmap",
                "careerOrientations",
            ],
        },
    },
};
