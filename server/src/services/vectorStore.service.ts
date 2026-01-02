import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import path from "path";
import Logger from "../utils/logger";
import dotenv from 'dotenv';

dotenv.config();

class VectorStoreService {
    private static instance: VectorStoreService;
    private vectorStore: MemoryVectorStore | null = null;
    private isInitialized: boolean = false;

    private constructor() { }

    public static getInstance(): VectorStoreService {
        if (!VectorStoreService.instance) {
            VectorStoreService.instance = new VectorStoreService();
        }
        return VectorStoreService.instance;
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            Logger.info("VectorStoreService đã được khởi tạo trước đó.");
            return;
        }

        Logger.info("⏳ Đang khởi tạo Knowledge Base (đọc PDFs)...");

        try {
            // 1. Load Documents
            const handbookPath = path.join(__dirname, "../../data/SO_TAY_SV_2024.pdf");
            const regulationPath = path.join(__dirname, "../../data/1727_qd_quy_che.pdf");

            const loaderHandbook = new PDFLoader(handbookPath);
            const loaderRegulation = new PDFLoader(regulationPath);

            const [handbookDocs, regulationDocs] = await Promise.all([
                loaderHandbook.load(),
                loaderRegulation.load()
            ]);

            const allDocs = [...handbookDocs, ...regulationDocs];
            Logger.info(`   - Đã đọc ${allDocs.length} trang tài liệu.`);

            // 2. Split Text
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });

            const splits = await textSplitter.splitDocuments(allDocs);
            Logger.info(`   - Đã chia thành ${splits.length} chunks.`);

            // 3. Create Vector Store
            // @ts-ignore
            this.vectorStore = await MemoryVectorStore.fromDocuments(
                splits,
                new GoogleGenerativeAIEmbeddings({
                    apiKey: process.env.API_KEY,
                    modelName: "embedding-001",
                    taskType: "RETRIEVAL_DOCUMENT" as any,
                })
            );

            this.isInitialized = true;
            Logger.success("✅ Knowledge Base đã sẵn sàng!");

        } catch (error) {
            Logger.error("❌ Lỗi khởi tạo Knowledge Base:", error);
            // Không throw error để server vẫn chạy được dù lỗi đọc PDF
        }
    }

    public async search(query: string, k: number = 4): Promise<string> {
        if (!this.vectorStore) {
            Logger.warn("Knowledge Base chưa sẵn sàng. Trả về rỗng.");
            return "";
        }

        try {
            const results = await this.vectorStore.similaritySearch(query, k);

            // Format kết quả thành chuỗi text để đưa vào prompt
            const context = results.map(doc => doc.pageContent).join("\n\n---\n\n");
            return context;
        } catch (error) {
            Logger.error("Lỗi tìm kiếm trong Knowledge Base:", error);
            return "";
        }
    }
}

export default VectorStoreService.getInstance();
