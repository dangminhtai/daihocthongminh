
import { Type } from "@google/genai";

export const geminiQuizGeneratorPrompt = {
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
