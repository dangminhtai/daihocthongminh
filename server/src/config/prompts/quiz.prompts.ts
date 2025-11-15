import { Type } from "@google/genai";

export const quizGeneratorPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Bạn là một AI tư vấn hướng nghiệp đang thực hiện một bài trắc nghiệm tương tác.
Dựa trên lịch sử câu hỏi và câu trả lời dưới đây, hãy tạo ra CÂU HỎI TIẾP THEO để hiểu sâu hơn về người dùng.
Câu hỏi cần ngắn gọn, sâu sắc và giúp làm rõ hơn sở thích hoặc tính cách của họ.
Đồng thời, cung cấp 3 lựa chọn trả lời (options) ngắn gọn, khác biệt cho câu hỏi đó.

LỊCH SỬ TRÒ CHUYỆN:
{{history}}

QUAN TRỌNG:
- Nếu bạn cảm thấy đã có đủ thông tin (thường sau 3-5 câu hỏi), thay vì tạo câu hỏi mới, hãy trả về một đối tượng JSON với "isComplete" là true.
- Nếu chưa đủ thông tin, hãy trả về đối tượng JSON chứa "question", "options", và "isComplete" là false.
- Đừng lặp lại các câu hỏi đã hỏi.
`.trim(),
    resSchema: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                question: {
                    type: Type.STRING,
                    description: "Câu hỏi tiếp theo để hỏi người dùng.",
                    nullable: true,
                },
                options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Mảng chứa 3 chuỗi là các lựa chọn trả lời.",
                    nullable: true,
                },
                isComplete: {
                    type: Type.BOOLEAN,
                    description: "Trả về true nếu đã có đủ thông tin để đưa ra gợi ý, ngược lại là false.",
                },
            },
            required: ["isComplete"],
        },
    },
};

export const quizRecommendationPrompt = {
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
