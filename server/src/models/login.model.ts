import { Schema, model, Document } from "mongoose";

export interface ILogin extends Document {
    gmail: string;
    mssv: string;
    password: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
}

const LoginSchema = new Schema<ILogin>(
    {
        gmail: { type: String, required: true, unique: true },
        mssv: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        passwordResetToken: { type: String },
        passwordResetExpires: { type: Date },
    },
    { timestamps: true }
);

export const Login = model<ILogin>("Login", LoginSchema);