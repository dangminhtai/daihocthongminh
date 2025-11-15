
import { Type } from "@google/genai";

export const geminiCareerPrompt = {
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
