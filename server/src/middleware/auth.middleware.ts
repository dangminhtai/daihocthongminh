
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import Logger from '../utils/logger';

// Mở rộng kiểu Request của Express để chứa thuộc tính user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header
            token = req.headers.authorization.split(' ')[1];

            // Xác thực token và lấy payload (chứa _id của User)
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

            // Tìm người dùng trực tiếp bằng _id từ token
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ message: 'Không được phép, người dùng không tồn tại, hãy thử tạo tài khoản mới' });
            }

            // Gắn đối tượng user vào request để các route sau có thể sử dụng
            req.user = user;
            next();
        } catch (error: any) {
            let userInfo: any = null;
            let userName = 'Unknown';
            if (token) {
                try {
                    userInfo = jwt.decode(token);
                    if (userInfo && userInfo.id) {
                        const userFound = await User.findById(userInfo.id).select('fullName');
                        if (userFound) {
                            userName = userFound.fullName;
                        }
                    }
                } catch (decodeError) {
                    console.error("Lỗi decode token cho mục đích log:", decodeError);
                }
            }
            Logger.error('Lỗi xác thực token:', {
                error: error.message,
                stack: error.stack,
                expiredAt: error.expiredAt,
                userInfo,
                userName
            });
            res.status(401).json({ message: 'Không được phép, token không hợp lệ..vui lòng đăng nhập lại' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không được phép, không có token' });
    }
};
