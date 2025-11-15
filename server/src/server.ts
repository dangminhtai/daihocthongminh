import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Item from './models/item.model'; // Import model
// Import các file routes
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/item.routes';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // **Rất quan trọng**: để parse JSON body từ request

// Kết nối MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("Lỗi: Biến môi trường MONGO_URI chưa được thiết lập.");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Đã kết nối thành công với MongoDB!');
        // Thêm một vài dữ liệu mẫu nếu database trống
    })
    .catch((error) => console.error('Lỗi kết nối MongoDB:', error));

// API 1: Lấy tất cả items
app.get('/api/items', async (req: Request, res: Response) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error });
    }
});

// API 2: Tạo một item mới
app.post('/api/items', async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Tên và mô tả là bắt buộc' });
        }

        const newItem = new Item({
            name,
            description,
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo item', error });
    }
});
// Sử dụng routes
// Tất cả các route trong authRoutes sẽ có tiền tố là /api/auth
app.use('/api/auth', authRoutes);
// Tất cả các route trong itemRoutes sẽ có tiền tố là /api/items
app.use('/api/items', itemRoutes);
// Hàm thêm dữ liệu mẫu

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});