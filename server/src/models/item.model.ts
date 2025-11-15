import mongoose, { Schema, Document } from 'mongoose';

// Interface để định nghĩa kiểu dữ liệu của một Item
export interface IItem extends Document {
    name: string;
    description: string;
}

// Schema định nghĩa cấu trúc của document trong MongoDB
const ItemSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

// Tạo và export Model
export default mongoose.model<IItem>('Item', ItemSchema);