import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { Login } from '../models/login.model';

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

            // Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

            // Tìm thông tin đăng nhập từ token
            const loginInfo = await Login.findById(decoded.id).select('-password');
            if (!loginInfo) {
                return res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
            }

            // Tìm người dùng tương ứng
            const user = await User.findOne({ loginID: loginInfo._id });
            if (!user) {
                return res.status(401).json({ message: 'Không được phép, người dùng không tồn tại' });
            }

            // Gắn đối tượng user vào request
            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không được phép, không có token' });
    }
};
