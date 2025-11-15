import { Schema, model, Document } from "mongoose";

export interface ILogin extends Document {
    gmail: string;
    mssv?: string;
    password?: string; // Mật khẩu không còn là bắt buộc
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    // Thêm các trường ID từ nhà cung cấp OAuth
    googleId?: string;
    facebookId?: string;
    githubId?: string;
}

const LoginSchema = new Schema<ILogin>(
    {
        gmail: { type: String, required: true, unique: true },
        mssv: { type: String, unique: true, sparse: true },
        password: { type: String, required: false },
        passwordResetToken: { type: String },
        passwordResetExpires: { type: Date },
        googleId: { type: String, unique: true, sparse: true },
        facebookId: { type: String, unique: true, sparse: true },
        githubId: { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

export const Login = model<ILogin>("Login", LoginSchema);