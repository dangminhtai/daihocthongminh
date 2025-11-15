
import mongoose, { Schema, Document, Types } from 'mongoose';

const CVEducationSchema = new Schema({ id: String, school: String, degree: String, fieldOfStudy: String, startDate: String, endDate: String, description: String }, { _id: false });
const CVExperienceSchema = new Schema({ id: String, company: String, jobTitle: String, startDate: String, endDate: String, description: String }, { _id: false });
const CVSkillSchema = new Schema({ id: String, skillName: String, level: String }, { _id: false });
const CVProjectSchema = new Schema({ id: String, projectName: String, description: String, link: String }, { _id: false });

export interface ICV extends Document {
    userId: Types.ObjectId;
    template: string;
    personalDetails: {
        fullName: string;
        jobTitle: string;
        email: string;
        phoneNumber: string;
        address: string;
        avatarUrl: string;
    };
    summary: string;
    education: any[];
    experience: any[];
    skills: any[];
    projects: any[];
}

const CVSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    template: { type: String, default: 'classic' },
    personalDetails: {
        fullName: String,
        jobTitle: String,
        email: String,
        phoneNumber: String,
        address: String,
        avatarUrl: String,
    },
    summary: String,
    education: [CVEducationSchema],
    experience: [CVExperienceSchema],
    skills: [CVSkillSchema],
    projects: [CVProjectSchema],
}, { timestamps: true });

export const CV = mongoose.model<ICV>('CV', CVSchema);
