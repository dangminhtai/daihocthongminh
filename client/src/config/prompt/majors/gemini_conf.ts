
import { Type } from "@google/genai";

export const geminiMajorPrompt = {
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
