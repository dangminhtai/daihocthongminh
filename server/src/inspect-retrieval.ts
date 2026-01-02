
import dotenv from 'dotenv';
dotenv.config();

import VectorStoreService from './services/vectorStore.service';

async function run() {
    console.log("--- INSPECT RETRIEVAL START ---");

    // Initialize
    console.log("Initializing Vector Store...");
    await VectorStoreService.initialize();

    const query = "Điều kiện xét học bổng khuyến khích là gì?";
    console.log(`\nSearching for: "${query}"`);

    try {
        // Search with k=4 (default)
        const context = await VectorStoreService.search(query, 4);

        console.log("\n=== RETRIEVED CONTEXT (FULL) ===");
        console.log(context);
        console.log("================================");

    } catch (e) {
        console.error("Error during search:", e);
    }
    console.log("\n--- INSPECT RETRIEVAL END ---");
}

run();
