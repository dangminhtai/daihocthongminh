// server/src/utils/ingest-data.ts
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from "path";

async function processDocs() {
    try {
        // 1. Định nghĩa đường dẫn file
        // Giả sử bạn để file trong folder server/data/
        const handbookPath = path.join(__dirname, "../../data/SO_TAY_SV_2024.pdf");
        const regulationPath = path.join(__dirname, "../../data/1727_qd_quy_che.pdf");

        console.log("... Đang đọc file PDF ...");

        // 2. Load PDF
        const loaderHandbook = new PDFLoader(handbookPath);
        const loaderRegulation = new PDFLoader(regulationPath);

        const handbookDocs = await loaderHandbook.load();
        const regulationDocs = await loaderRegulation.load();

        const allDocs = [...handbookDocs, ...regulationDocs];
        console.log(`✅ Đã đọc xong: ${allDocs.length} trang tài liệu.`);

        // 3. CHUNKING (Chia nhỏ) - QUAN TRỌNG NHẤT
        /* Tại sao lại là 1000 và 200?
           - chunkSize: 1000 ký tự (khoảng 1 đoạn văn đầy đủ ý).
           - chunkOverlap: 200 ký tự (để đoạn sau gối lên đoạn trước, giúp AI không bị mất ngữ cảnh ở vết cắt).
        */
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splits = await textSplitter.splitDocuments(allDocs);

        console.log(`✂️ Đã chia nhỏ thành: ${splits.length} chunks (mẩu tin).`);

        // Test thử xem 1 chunk trông như thế nào
        console.log("--- VÍ DỤ 1 CHUNK ---");
        console.log(splits[0].pageContent);
        console.log("---------------------");

        // TODO: Bước tiếp theo là lưu cái 'splits' này vào Vector Database (sẽ làm ở bước sau)
        return splits;

    } catch (error) {
        console.error("Lỗi xử lý file:", error);
    }
}

// Chạy hàm
processDocs();