import { Schema, model, Document } from 'mongoose';

export interface ILog extends Document {
    level: string;
    message: string;
    meta?: any;
    timestamp: Date;
}

const LogSchema = new Schema<ILog>({
    level: { type: String, required: true },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: { expires: '30d' } } // Auto-delete after 30 days
});

export const Log = model<ILog>('Log', LogSchema);
