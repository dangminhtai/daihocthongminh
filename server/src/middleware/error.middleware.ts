import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi server nội bộ';

    Logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, {
        stack: err.stack,
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.user ? req.user._id : 'Guest'
    });

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};
