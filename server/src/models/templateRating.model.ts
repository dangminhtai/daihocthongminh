
import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { ICVTemplate } from './cvTemplate.model';

export interface ITemplateRating extends Document {
    userId: Types.ObjectId | IUser;
    templateId: Types.ObjectId | ICVTemplate;
    rating: number;
}

const TemplateRatingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'CVTemplate', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// Ensure a user can only rate a template once
TemplateRatingSchema.index({ userId: 1, templateId: 1 }, { unique: true });

export const TemplateRating = mongoose.model<ITemplateRating>('TemplateRating', TemplateRatingSchema);
