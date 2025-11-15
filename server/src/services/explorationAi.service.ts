
import { GenerateContentParameters } from "@google/genai";
import { ai, callAIAndParseJSON } from './gemini';
import { MajorSuggestion, CareerSuggestion, MajorDetails, School } from "../../../client/src/class/types";
import { majorSuggestionPrompt, careerSuggestionPrompt, majorDetailsPrompt, findSchoolsPrompt } from "../config/prompts/exploration.prompts";

// Helper function to parse markdown from school search
const parseSchoolMarkdown = (markdown: string, chunks: any[]): School[] => {
    const schools: School[] = [];
    const sections = markdown.split('###').slice(1); // Split by ### and remove the first empty element

    sections.forEach((section, index) => {
        const nameMatch = section.match(/(.+?)\n/);
        const name = nameMatch ? nameMatch[1].trim() : `Trường học ${index + 1}`;

        const addressMatch = section.match(/\*\*Địa chỉ:\*\*\s*(.+)/);
        const address = addressMatch ? addressMatch[1].trim() : "Không có thông tin địa chỉ";

        const strengthsMatch = section.match(/\*\*Điểm mạnh:\*\*\s*\n([\s\S]*?)(?=\*\*Điểm yếu:\*\*|\n\n|###|$)/);
        const strengths = strengthsMatch ? strengthsMatch[1].trim().split('\n- ').filter(s => s.trim()) : [];

        const weaknessesMatch = section.match(/\*\*Điểm yếu:\*\*\s*\n([\s\S]*?)(?=\n\n|###|$)/);
        const weaknesses = weaknessesMatch ? weaknessesMatch[1].trim().split('\n- ').filter(s => s.trim()) : [];

        // Cố gắng liên kết với grounding chunk. Giả định thứ tự là tương đối nhất quán.
        const uri = chunks[index]?.maps?.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

        schools.push({
            name,
            address,
            strengths,
            weaknesses,
            uri
        });
    });

    return schools;
};


/**
 * Gợi ý các chuyên ngành dựa trên một lộ trình học tập.
 * @param roadmapName - Tên của lộ trình học tập.
 * @returns - Danh sách các gợi ý chuyên ngành.
 */
export const suggestMajorsForRoadmap = async (roadmapName: string): Promise<MajorSuggestion[]> => {
    const request: GenerateContentParameters = {
        model: majorSuggestionPrompt.model,
        contents: majorSuggestionPrompt.contents.replace("{{roadmapName}}", roadmapName),
        config: majorSuggestionPrompt.resSchema,
    };
    return callAIAndParseJSON<MajorSuggestion[]>(request);
};

/**
 * Gợi ý các nghề nghiệp dựa trên danh sách môn học yêu thích.
 * @param subjectNames - Mảng các tên môn học.
 * @returns - Danh sách các gợi ý nghề nghiệp.
 */
export const suggestCareersForSubjects = async (subjectNames: string[]): Promise<CareerSuggestion[]> => {
    const subjectsText = subjectNames.join(', ');
    const request: GenerateContentParameters = {
        model: careerSuggestionPrompt.model,
        contents: careerSuggestionPrompt.contents.replace("{{subjects}}", subjectsText),
        config: careerSuggestionPrompt.resSchema,
    };
    return callAIAndParseJSON<CareerSuggestion[]>(request);
};

/**
 * Lấy thông tin chi tiết về một chuyên ngành cụ thể.
 * @param majorName - Tên của chuyên ngành.
 * @returns - Đối tượng chứa thông tin chi tiết về chuyên ngành.
 */
export const getMajorDetails = async (majorName: string): Promise<MajorDetails> => {
    const request: GenerateContentParameters = {
        model: majorDetailsPrompt.model,
        contents: majorDetailsPrompt.contents.replace("{{majorName}}", majorName),
        config: majorDetailsPrompt.resSchema,
    };
    return callAIAndParseJSON<MajorDetails>(request);
};

/**
 * Tìm các trường học gần vị trí người dùng sử dụng Google Maps Grounding.
 * @param schoolType - Loại trường ('university', 'high_school', 'middle_school').
 * @param location - Tọa độ của người dùng.
 * @returns - Danh sách các trường học với thông tin chi tiết.
 */
export const findSchoolsNearLocation = async (schoolType: string, location: { latitude: number; longitude: number; }): Promise<School[]> => {
    const schoolTypeVietnamese = {
        university: 'trường đại học',
        high_school: 'trường trung học phổ thông (cấp 3)',
        middle_school: 'trường trung học cơ sở (cấp 2)'
    }[schoolType] || 'trường học';

    const request: GenerateContentParameters = {
        model: findSchoolsPrompt.model,
        contents: findSchoolsPrompt.contents.replace("{{schoolType}}", schoolTypeVietnamese),
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }
                }
            }
        },

    };

    try {
        const response = await ai.models.generateContent(request);
        const markdownText = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        if (!markdownText) {
            throw new Error("AI không trả về kết quả.");
        }

        return parseSchoolMarkdown(markdownText, groundingChunks);

    } catch (error: any) {
        console.error("Lỗi khi tìm trường học:", error);
        throw new Error(`Lỗi từ AI service khi tìm trường học: ${error.message}`);
    }
};