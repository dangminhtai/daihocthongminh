
import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IRating extends Document {
    userId: Types.ObjectId | IUser;
    rating: number;
    feedback?: string;
}

const RatingSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Mỗi người dùng chỉ có một bản ghi rating
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        trim: true
    },
}, { timestamps: true });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
