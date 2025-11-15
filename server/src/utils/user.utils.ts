
import { User } from '../models/user.model';

/**
 * Generates a unique, 15-digit numeric string user ID.
 * It ensures uniqueness by checking against the database.
 */
export const generateUniqueUserId = async (): Promise<string> => {
    let userId: string;
    let userExists = true;

    while (userExists) {
        // Generate a 15-digit random number as a string
        userId = Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
        const existingUser = await User.findOne({ userId });
        if (!existingUser) {
            userExists = false;
        }
    }
    return userId!;
};

/**
 * Generates a default SVG avatar as a Base64 data URI.
 * @param name The user's full name.
 */
export const generateDefaultAvatar = (name: string): string => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : '?';

    // Simple hashing to get a color from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 75%, 60%)`;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="${color}" />
            <text x="50" y="50" font-family="Arial, sans-serif" font-size="50" fill="white" text-anchor="middle" dy=".3em">${firstLetter}</text>
        </svg>
    `;

    // Buffer is globally available in Node.js
    const base64 = Buffer.from(svg).toString('base64');

    return `data:image/svg+xml;base64,${base64}`;
};
