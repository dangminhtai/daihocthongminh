export const cvEnhanceDescriptionPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Hãy viết lại đoạn mô tả công việc/dự án sau đây cho một CV sinh viên, sử dụng các động từ mạnh, ngôn ngữ chuyên nghiệp và tập trung vào kết quả (nếu có thể). Giữ cho nó súc tích và đi thẳng vào vấn đề.
Chỉ trả về kết quả thuần không markdown, không xưng bạn với người dùng, bạn chỉ có nhiệm vụ sửa thêm, cải thiện những gì mà người dùng mô tả
Mô tả gốc: "{{description}}"
`.trim(),
};
