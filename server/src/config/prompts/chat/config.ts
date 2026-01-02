import { persona } from './persona';
import { task } from './task';
import { context } from './context';
import { format } from './format';

console.log("--> [Config] Initializing Chat System Prompt...");

export const chatConfig = {
    systemInstruction: `
${context}

${persona}

${format}

${task}
    `.trim(),
};