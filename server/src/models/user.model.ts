import { Schema, model, Document, Types } from "mongoose";
import { ILogin } from "./login.model";

export interface IUser extends Document {
    loginID: Types.ObjectId | ILogin;
    fullName: string;
    mssv?: string;
}

const UserSchema = new Schema<IUser>(
    {
        loginID: { type: Schema.Types.ObjectId, ref: "Login", required: true },
        fullName: { type: String, required: true },
        mssv: { type: String },
    },
    { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
