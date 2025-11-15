import { Type } from "@google/genai";

export const majorSuggestionPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Dựa trên lộ trình học tập "{{roadmapName}}", hãy đề xuất 5 chuyên ngành đại học phù hợp. 
Với mỗi chuyên ngành, cung cấp mô tả ngắn gọn (2-3 câu) 
và danh sách các kỹ năng cốt lõi cần có.
  `.trim(),
    resSchema: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    majorName: {
                        type: Type.STRING,
                        description: "Tên chuyên ngành được đề xuất."
                    },
                    description: {
                        type: Type.STRING,
                        description: "Mô tả ngắn gọn về chuyên ngành."
                    },
                    coreSkills: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Danh sách kỹ năng cốt lõi của chuyên ngành."
                    }
                },
                required: ["majorName", "description", "coreSkills"]
            }
        }
    }
};

export const careerSuggestionPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Tôi là một sinh viên đại học và các môn học yêu thích của tôi là: {{subjects}}. 
Dựa trên những sở thích này, hãy đề xuất 5 định hướng nghề nghiệp tiềm năng. 
Với mỗi định hướng, cung cấp một mô tả ngắn gọn về công việc và lý do tại sao 
nó phù hợp với các môn học đã chọn.
  `.trim(),
    resSchema: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    careerName: {
                        type: Type.STRING,
                        description: "Tên của định hướng nghề nghiệp."
                    },
                    description: {
                        type: Type.STRING,
                        description: "Mô tả ngắn gọn về công việc và triển vọng."
                    },
                    suitability: {
                        type: Type.STRING,
                        description: "Giải thích lý do phù hợp với các môn đã chọn."
                    }
                },
                required: ["careerName", "description", "suitability"]
            }
        }
    }
};

export const majorDetailsPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Cung cấp thông tin chi tiết về chuyên ngành đại học "{{majorName}}".
Thông tin cần bao gồm:
1.  Mục tiêu đào tạo (trainingObjectives): Mô tả chi tiết các kiến thức và kỹ năng sinh viên sẽ đạt được (khoảng 2-4 câu).
2.  Các môn học chính (mainSubjects): Liệt kê 5-7 môn học cốt lõi, quan trọng nhất của chuyên ngành.
3.  Các môn học tự chọn (electiveSubjects): Liệt kê 3-5 môn học tự chọn tiêu biểu.
4.  Lộ trình học tập (curriculumRoadmap): Mô tả tóm tắt lộ trình qua các năm học (ví dụ: Năm 1 học gì, Năm 2 học gì...). Mỗi năm là một mục.
5.  Định hướng nghề nghiệp (careerOrientations): Liệt kê 4-6 vị trí công việc, vai trò mà sinh viên có thể đảm nhận sau khi tốt nghiệp.
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
