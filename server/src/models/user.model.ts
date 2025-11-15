
import { Schema, model, Document, Types } from "mongoose";
import { ILogin } from "./login.model";

export interface IUser extends Document {
    loginID: Types.ObjectId | ILogin;
    fullName: string;
    mssv?: string;
    userId: string;
    avatarUrl: string;
    department?: string; // Khoa
    class?: string; // Lớp
    dateOfBirth?: Date; // Ngày sinh
    phoneNumber?: string; // Số điện thoại
    bio?: string; // Mô tả ngắn
}

const UserSchema = new Schema<IUser>(
    {
        loginID: { type: Schema.Types.ObjectId, ref: "Login", required: true },
        fullName: { type: String, required: true },
        mssv: { type: String },
        userId: { type: String, required: true, unique: true },
        avatarUrl: { type: String, required: true },
        department: { type: String, required: false },
        class: { type: String, required: false },
        dateOfBirth: { type: Date, required: false },
        phoneNumber: { type: String, required: false },
        bio: { type: String, required: false },
    },
    { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);