import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';

interface IMessage {
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export interface IChatHistory extends Document {
    userId: Types.ObjectId | IUser;
    channelId: string;
    messages: IMessage[];
}

const MessageSchema: Schema = new Schema({
    role: { type: String, enum: ['user', 'model'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });

const ChatHistorySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    channelId: { type: String, required: true, index: true },
    messages: [MessageSchema],
}, { timestamps: true });

// Tạo một compound index để tối ưu việc truy vấn
ChatHistorySchema.index({ userId: 1, channelId: 1 }, { unique: true });

export default mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
