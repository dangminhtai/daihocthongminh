import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model";

interface IMessagePart {
    text?: string;
    fileData?: {
        mimeType?: string;
        fileUri?: string;
    };
}

interface IChatTurn {
    user: {
        parts: IMessagePart[];
    };
    model: {
        parts: IMessagePart[];
    };
    createdAt?: Date;
}

export interface IChatHistory extends Document {
    userId: IUser['_id'];
    channelId: string;
    turns: IChatTurn[];
}

const messagePartSchema = new Schema<IMessagePart>({
    text: { type: String },
    fileData: {
        mimeType: { type: String },
        fileUri: { type: String },
    },
}, { _id: false });

const chatTurnSchema = new Schema<IChatTurn>({
    user: {
        parts: [messagePartSchema],
    },
    model: {
        parts: [messagePartSchema],
    },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });

const chatSchema = new Schema<IChatHistory>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    channelId: { type: String, required: true },
    turns: [chatTurnSchema],
});

chatSchema.index({ userId: 1, channelId: 1 });

const ChatHistory: Model<IChatHistory> = mongoose.model<IChatHistory>("ChatHistory", chatSchema);

export default ChatHistory;