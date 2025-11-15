import { ai } from './gemini';
import { chatConfig } from '../config/prompts/chat.prompts';

/**
 * Bắt đầu một cuộc trò chuyện mới hoặc tiếp tục cuộc trò chuyện cũ và nhận phản hồi từ AI.
 * @param history - Lịch sử cuộc trò chuyện trước đó.
 * @param message - Tin nhắn mới từ người dùng.
 * @returns - Phản hồi dạng văn bản từ AI.
 */
export const getChatResponse = async (history: any[], message: string): Promise<string> => {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: history,
        config: {
            systemInstruction: chatConfig.systemInstruction,
        }
    });
    const response = await chat.sendMessage({ message });
    const responseText = response.text;

    if (typeof responseText !== 'string') {
        throw new Error("AI không đưa ra phản hồi hợp lệ.");
    }

    return responseText;
};
