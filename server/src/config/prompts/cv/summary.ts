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
