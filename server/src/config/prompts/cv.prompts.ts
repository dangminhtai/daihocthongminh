
import { Type } from "@google/genai";

export const cvSummaryPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Dựa trên thông tin CV sau đây của một sinh viên, hãy viết một đoạn tóm tắt mục tiêu nghề nghiệp (summary) chuyên nghiệp, súc tích và hấp dẫn (khoảng 3-4 câu). Đoạn tóm tắt cần làm nổi bật những điểm mạnh, kỹ năng chính và kinh nghiệm phù hợp nhất.
Chỉ trả về kết quả thuần không markdown, không xưng bạn với người dùng, bạn chỉ có nhiệm vụ sửa thêm, cải thiện những gì mà người dùng mô tả

- Vị trí mong muốn: {{jobTitle}}
- Học vấn: {{education}}
- Kinh nghiệm: {{experience}}
- Kỹ năng: {{skills}}
Hãy trả lời trực tiếp bằng đoạn văn tóm tắt, không cần câu mở đầu.
`.trim(),
};


export const cvEnhanceDescriptionPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Hãy viết lại đoạn mô tả công việc/dự án sau đây cho một CV sinh viên, sử dụng các động từ mạnh, ngôn ngữ chuyên nghiệp và tập trung vào kết quả (nếu có thể). Giữ cho nó súc tích và đi thẳng vào vấn đề.
Chỉ trả về kết quả thuần không markdown, không xưng bạn với người dùng, bạn chỉ có nhiệm vụ sửa thêm, cải thiện những gì mà người dùng mô tả
Mô tả gốc: "{{description}}"
`.trim(),
};
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