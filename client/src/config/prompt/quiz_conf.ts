
import { Type } from "@google/genai";

export const geminiQuizPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Bạn là một chuyên gia tư vấn hướng nghiệp dày dặn kinh nghiệm. Một sinh viên vừa hoàn thành bài trắc nghiệm tính cách và sở thích. Dưới đây là các câu trả lời của họ:
{{answers}}

Dựa trên những thông tin này, hãy phân tích sâu sắc về tính cách, điểm mạnh và sở thích của sinh viên. Sau đó, đề xuất 3 định hướng nghề nghiệp phù hợp nhất.
Với mỗi định hướng, hãy cung cấp:
1.  Tên nghề nghiệp (careerName).
2.  Mô tả ngắn gọn về nghề nghiệp (description).
3.  Lý do phù hợp (suitability): Giải thích tại sao nghề nghiệp này lại phù hợp với các câu trả lời của sinh viên, liên kết cụ thể từng câu trả lời với các khía cạnh của nghề nghiệp.
4.  Các ngành học gợi ý (suggestedMajors): Liệt kê 2-3 ngành học đại học liên quan trực tiếp đến nghề nghiệp đó.
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
                        description: "Giải thích chi tiết lý do tại sao nghề nghiệp này phù hợp dựa trên câu trả lời của sinh viên."
                    },
                    suggestedMajors: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Danh sách các ngành học đại học liên quan."
                    }
                },
                required: ["careerName", "description", "suitability", "suggestedMajors"]
            }
        }
    }
};
