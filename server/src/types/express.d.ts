import { User } from "../models/user.model"; // đường dẫn model của anh

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
