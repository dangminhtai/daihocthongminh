import { ai } from './gemini';
import { chatConfig } from '../config/prompts/chat.prompts';
import { GenerateContentParameters } from '@google/genai';

interface IChatTurn {
    user: { parts: { text?: string }[] };
    model: { parts: { text?: string }[] };
}

/**
 * Bắt đầu một cuộc trò chuyện mới hoặc tiếp tục cuộc trò chuyện cũ và nhận phản hồi từ AI.
 * @param historyTurns - Lịch sử cuộc trò chuyện trước đó theo cấu trúc 'turns'.
 * @param message - Tin nhắn mới từ người dùng.
 * @param useGoogleSearch - Cờ để xác định có sử dụng Google Search hay không.
 * @returns - Phản hồi dạng văn bản từ AI.
 */
export const getChatResponse = async (historyTurns: IChatTurn[], message: string, useGoogleSearch: boolean = false): Promise<string> => {
    
    // Chuyển đổi cấu trúc 'turns' thành định dạng history mà Gemini API yêu cầu
    const history = historyTurns.flatMap(turn => ([
        { role: 'user', parts: turn.user.parts.map(p => ({ text: p.text || '' })) },
        { role: 'model', parts: turn.model.parts.map(p => ({ text: p.text || '' })) }
    ]));

    const contents = [...history, { role: 'user', parts: [{ text: message }] }];

    const request: GenerateContentParameters = {
        model: "gemini-2.5-flash-lite",
        contents: contents,
        config: {
            systemInstruction: chatConfig.systemInstruction,
        },
    };

    // Thêm công cụ Google Search nếu được yêu cầu
    if (useGoogleSearch) {
        request.config = {
            ...request.config,
            tools: [{ googleSearch: {} }],
        };
    }
    
    const response = await ai.models.generateContent(request);
    const responseText = response.text;

    if (typeof responseText !== 'string') {
        throw new Error("AI không đưa ra phản hồi hợp lệ.");
    }
    
    return responseText;
};