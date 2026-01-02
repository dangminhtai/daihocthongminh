
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

async function run() {
    console.log("--- DEBUG PDF CONTENT ---");
    const handbookPath = path.join(__dirname, "../data/SO_TAY_SV_2024.pdf");

    try {
        const loader = new PDFLoader(handbookPath);
        const docs = await loader.load();

        console.log(`Total Pages: ${docs.length}`);

        // Print first 3 pages to check layout/text quality
        for (let i = 0; i < 3; i++) {
            if (docs[i]) {
                console.log(`\n\n=== PAGE ${i + 1} ===\n`);
                console.log(docs[i].pageContent.substring(0, 1000)); // Print first 1000 chars of page
            }
        }

        // Search for specific keyword text to see how it looks
        console.log("\n\n=== SEARCHING FOR 'KHUYẾN KHÍCH' CONTEXT ===");
        const relevantPages = docs.filter(d => d.pageContent.toLowerCase().includes("khuyến khích"));
        console.log(`Found ${relevantPages.length} pages mentioning 'khuyến khích'.`);
        if (relevantPages.length > 0) {
            console.log("--- SAMPLE CONTEXT ---");
            // Show a snippet around the keyword
            const text = relevantPages[0].pageContent;
            const index = text.toLowerCase().indexOf("khuyến khích");
            // Print a larger window to see sentence structure
            console.log(text.substring(Math.max(0, index - 500), index + 1000));
        }

    } catch (e) {
        console.error("Error reading PDF:", e);
    }
}

run();
