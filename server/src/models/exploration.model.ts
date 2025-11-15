import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { EXPLORATION_TYPES, ExplorationType } from './constants';

export interface IExploration extends Document {
    userId: Types.ObjectId | IUser;
    type: ExplorationType;
    input: Record<string, any>; // e.g., { roadmapName: 'Công nghệ' } or { subjects: ['Toán', 'Lý'] }
    results: Record<string, any>[]; // Array of MajorSuggestion or CareerSuggestion
    createdAt: Date;
}

const ExplorationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(EXPLORATION_TYPES), required: true },
    input: { type: Schema.Types.Mixed, required: true },
    results: [{ type: Schema.Types.Mixed }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IExploration>('Exploration', ExplorationSchema);
