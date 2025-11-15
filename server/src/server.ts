import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// import path from 'path'; // Không cần thiết nữa

// Import các file routes
import authRoutes from './routes/auth.routes';
import quizRoutes from './routes/quiz.routes';
import explorationRoutes from './routes/exploration.routes';
import chatRoutes from './routes/chat.routes';
import userRoutes from './routes/user.routes'; // Import route người dùng mới

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // **Rất quan trọng**: để parse JSON body từ request
app.use(express.urlencoded({ extended: true })); // **FIX**: Thêm middleware để xử lý form data

// Phục vụ các file tĩnh từ thư mục 'public' - ĐÃ BỎ
// app.use('/public', express.static(path.join(__dirname, '../../public')));


// --- Kiểm tra các biến môi trường quan trọng ---
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoURI) {
    console.error("FATAL ERROR: Biến môi trường MONGO_URI chưa được thiết lập.");
    process.exit(1);
}
if (!jwtSecret) {
    console.error("FATAL ERROR: Biến môi trường JWT_SECRET chưa được thiết lập. Đây là nguyên nhân gây ra lỗi 401 Unauthorized.");
    process.exit(1);
}
// --- Kết thúc kiểm tra ---


// Kết nối MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Đã kết nối thành công với MongoDB!');
    })
    .catch((error) => console.error('Lỗi kết nối MongoDB:', error));

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/exploration', explorationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes); // Sử dụng route người dùng


app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});