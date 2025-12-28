import { Type } from "@google/genai";

export const cvRewritePrompt = {
    model: "gemini-2.5-flash-lite",
    contents: `
Bạn là một chuyên gia tuyển dụng nhân sự hàng đầu. Dựa trên toàn bộ dữ liệu CV dưới dạng JSON sau đây, hãy viết lại các phần văn bản (tóm tắt, mô tả kinh nghiệm, mô tả dự án) để chúng trở nên chuyên nghiệp, nhất quán, súc tích và ấn tượng hơn.
- Sử dụng các động từ mạnh.
- Tập trung vào kết quả và thành tích có thể đo lường được.
- Đảm bảo ngôn ngữ nhất quán và chuyên nghiệp trên toàn bộ CV.
- CHỈ trả về một đối tượng JSON chứa các trường đã được viết lại: 'summary', 'experience' (một mảng các đối tượng chỉ có 'description'), và 'projects' (một mảng các đối tượng chỉ có 'description'). Giữ nguyên số lượng các mục trong 'experience' và 'projects'.

Dữ liệu CV gốc:
{{cvJson}}
`.trim(),
    resSchema: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                summary: {
                    type: Type.STRING,
                    description: "Đoạn tóm tắt mục tiêu nghề nghiệp đã được viết lại."
                },
                experience: {
                    type: Type.ARRAY,
                    description: "Mảng các mô tả kinh nghiệm đã được viết lại.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: {
                                type: Type.STRING,
                                description: "Mô tả công việc đã được tối ưu hóa."
                            }
                        }
                    }
                },
                projects: {
                    type: Type.ARRAY,
                    description: "Mảng các mô tả dự án đã được viết lại.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: {
                                type: Type.STRING,
                                description: "Mô tả dự án đã được tối ưu hóa."
                            }
                        }
                    }
                }
            },
            required: ["summary", "experience", "projects"]
        }
    }
};
