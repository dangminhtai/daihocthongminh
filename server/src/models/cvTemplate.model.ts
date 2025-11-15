
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICVTemplateStructure {
    layout: 'classic' | 'modern';
    sectionOrder: string[];
}

export interface ICVTemplate extends Document {
    name: string;
    description?: string;
    thumbnailUrl?: string; // Sẽ được tạo tự động trong tương lai
    structure: ICVTemplateStructure;
    createdBy: Types.ObjectId;
    isPublic: boolean;
    isDefault: boolean; // Dùng để đánh dấu template mặc định
    usageCount: number;
    averageRating: number;
    ratingCount: number;
}

const CVTemplateStructureSchema = new Schema<ICVTemplateStructure>({
    layout: { type: String, required: true, enum: ['classic', 'modern'] },
    sectionOrder: { type: [String], required: true },
}, { _id: false });


const CVTemplateSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    thumbnailUrl: { type: String },
    structure: { type: CVTemplateStructureSchema, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false }, // Dùng để seed data
    usageCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
}, { timestamps: true });

export const CVTemplate = mongoose.model<ICVTemplate>('CVTemplate', CVTemplateSchema);