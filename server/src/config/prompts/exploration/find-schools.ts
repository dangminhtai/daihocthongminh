export const findSchoolsPrompt = {
    model: "gemini-2.5-flash",
    contents: `
Tìm 5 {{schoolType}} chất lượng tốt ở gần vị trí của người dùng.
Với mỗi trường, hãy cung cấp:
- Tên đầy đủ của trường.
- Địa chỉ chính xác.
- Một danh sách ngắn các điểm mạnh (ví dụ: chất lượng giảng dạy, cơ sở vật chất, thành tích nổi bật).
- Một danh sách ngắn các điểm yếu hoặc cần cải thiện (nếu có thông tin).

Sử dụng định dạng Markdown sau cho mỗi trường:
### [Tên trường]
**Địa chỉ:** [Địa chỉ của trường]
**Điểm mạnh:**
- [Điểm mạnh 1]
- [Điểm mạnh 2]
**Điểm yếu:**
- [Điểm yếu 1]
`.trim(),
};
