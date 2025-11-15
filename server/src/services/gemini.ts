import dotenv from 'dotenv';
import { GoogleGenAI, GenerateContentParameters } from "@google/genai";
dotenv.config();
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API Key chưa được cấu hình trên server. Vui lòng thêm API_KEY vào file .env của server.");
}

// Khởi tạo client duy nhất
export const ai = new GoogleGenAI({ apiKey });

/**
 * Hàm helper chung để gọi AI và phân tích cú pháp JSON một cách an toàn.
 * Các service khác sẽ sử dụng hàm này để tránh lặp lại code.
 * @param request - Đối tượng yêu cầu gửi đến Gemini API.
 * @returns - Promise chứa kết quả đã được parse thành JSON.
 */
export async function callAIAndParseJSON<T>(request: GenerateContentParameters): Promise<T> {
    try {
        const response = await ai.models.generateContent(request);
        const jsonText = response.text;

        if (!jsonText) {
            throw new Error("Phản hồi từ AI không chứa nội dung văn bản.");
        }

        return JSON.parse(jsonText.trim()) as T;
    } catch (error: any) {
        console.error("Lỗi khi gọi AI hoặc parse JSON:", error);
        console.error("Request đã gửi:", JSON.stringify(request.contents, null, 2));
        if (error instanceof SyntaxError) {
            throw new Error(`Lỗi phân tích cú pháp JSON từ phản hồi của AI: ${error.message}`);
        }
        throw new Error(`Lỗi từ AI service: ${error.message}`);
    }
}