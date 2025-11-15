
import { Schema, model, Document, Types } from "mongoose";
import { ILogin } from "./login.model";

export interface IUser extends Document {
    loginID: Types.ObjectId | ILogin;
    fullName: string;
    mssv?: string;
    userId: string;
    avatarUrl: string;
}

const UserSchema = new Schema<IUser>(
    {
        loginID: { type: Schema.Types.ObjectId, ref: "Login", required: true },
        fullName: { type: String, required: true },
        mssv: { type: String },
        userId: { type: String, required: true, unique: true },
        avatarUrl: { type: String, required: true },
    },
    { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
