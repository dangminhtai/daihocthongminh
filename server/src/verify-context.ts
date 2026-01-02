import dotenv from 'dotenv';
import path from 'path';

// Load env before imports that might use it (like gemini.ts)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { getChatResponse } from './services/chatAi.service';

async function main() {
    console.log("=== BẮT ĐẦU KIỂM TRA CONTEXT INJECTION ===");

    // 1. Kiểm tra API Key
    const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ ERROR: Không tìm thấy API KEY trong .env");
        process.exit(1);
    }
    console.log("✅ API Key found.");

    // 2. Mock input data
    const mockHistory: any[] = []; // Không cần lịch sử
    const userQuery = "Điều kiện xét học bổng khuyến khích là gì?";
    const mockUserParts = [{ text: userQuery }];

    console.log(`\n❓ Câu hỏi test: "${userQuery}"`);
    console.log("⏳ Đang gọi AI...");

    try {
        // Gọi hàm getChatResponse.
        // Hàm này sẽ log "=== FULL SYSTEM PROMPT START ===" chứa context.
        const response = await getChatResponse(mockHistory, mockUserParts);

        console.log("\n✅ AI Đã phản hồi:");
        console.log("--------------------------------------------------");
        console.log(response);
        console.log("--------------------------------------------------");

        console.log("\n=== KIỂM TRA HOÀN TẤT ===");

    } catch (error) {
        console.error("❌ Lỗi khi gọi getChatResponse:", error);
    }
}

main();
