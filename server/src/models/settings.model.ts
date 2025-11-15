
import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export type Theme = 'light' | 'dark' | 'system';

export interface ISettings extends Document {
    userId: Types.ObjectId | IUser;
    theme: Theme;
}

const SettingsSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
}, { timestamps: true });

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
