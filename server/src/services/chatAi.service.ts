import { ai } from './gemini';
import { chatConfig } from '../config/prompts/chat.prompts';
import { GenerateContentParameters, Part } from '@google/genai';
import fs from 'fs';
import path from 'path';

interface IMessagePart {
    text?: string;
    fileData?: {
        mimeType?: string;
        fileUri?: string;
    };
}

interface IChatTurn {
    user: { parts: IMessagePart[] };
    model: { parts: IMessagePart[] };
}

/**
 * Chuyển đổi URI tệp thành đối tượng GoogleGenerativeAI.Part cho cuộc gọi API.
 * @param uri - URI công khai của tệp (ví dụ: /uploads/chat/filename.png).
 * @param mimeType - Kiểu MIME của tệp.
 * @returns Một đối tượng Part với inlineData.
 */
const fileToGenerativePart = (uri: string, mimeType: string): Part => {
    const fullPath = path.join(__dirname, '../../../public', uri);
    return {
        inlineData: {
            data: fs.readFileSync(fullPath).toString("base64"),
            mimeType,
        },
    };
};

/**
 * Bắt đầu một cuộc trò chuyện mới hoặc tiếp tục cuộc trò chuyện cũ và nhận phản hồi từ AI.
 * @param historyTurns - Lịch sử cuộc trò chuyện trước đó theo cấu trúc 'turns'.
 * @param userMessageParts - Tin nhắn mới của người dùng, dưới dạng một mảng các phần (văn bản và/hoặc tệp).
 * @param useGoogleSearch - Cờ để xác định có sử dụng Google Search hay không.
 * @returns - Phản hồi dạng văn bản từ AI.
 */
export const getChatResponse = async (historyTurns: IChatTurn[], userMessageParts: IMessagePart[], useGoogleSearch: boolean = false): Promise<string> => {

    const history = historyTurns.flatMap(turn => {
        const userParts = turn.user.parts.map(p => p.text ? { text: p.text } : fileToGenerativePart(p.fileData!.fileUri!, p.fileData!.mimeType!));
        const modelParts = turn.model.parts.map(p => ({ text: p.text || '' }));
        return [
            { role: 'user', parts: userParts },
            { role: 'model', parts: modelParts }
        ];
    });

    // --- DEBUG ---
    console.log("--> getChatResponse called. Query check starts.");
    // --- DEBUG ---

    const newUserParts: Part[] = [];
    let hasFile = false;
    let userTextQuery_forContext = "";

    for (const part of userMessageParts) {
        console.log("--> Part:", JSON.stringify(part));
        if (part.text) {
            newUserParts.push({ text: part.text });
            userTextQuery_forContext += part.text + " ";
        }
        if (part.fileData) {
            hasFile = true;
            newUserParts.push(fileToGenerativePart(part.fileData.fileUri!, part.fileData.mimeType!));
        }
    }

    // --- CONTEXT INJECTION DISABLED ---
    // User requested to inject full files directly into prompt config instead of using vector store.
    // See src/config/prompts/chat/config.ts
    // ----------------------------------
    let systemInstruction = chatConfig.systemInstruction;

    console.log("=== FULL SYSTEM PROMPT START ===");
    console.log(systemInstruction); // systemInstruction now includes the full MD files
    console.log("=== FULL SYSTEM PROMPT END ===");

    const contents = [...history, { role: 'user', parts: newUserParts }];

    const request: GenerateContentParameters = {
        model: 'gemini-2.5-flash', // Hạ xuống 1.5-flash để ổn định (hoặc giữ 2.5-flash-lite nếu đã support)
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        },
    };

    if (useGoogleSearch && !hasFile) { // Google Search tool không hoạt động tốt với hình ảnh
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