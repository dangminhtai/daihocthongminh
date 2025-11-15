# HACKATHON HCMUTE với chủ đề "Đại học thông minh - nâng tầm giáo dục"

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/) [![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)](https://nodejs.org/) [![Vite](https://img.shields.io/badge/Vite-7.x-purple?logo=vite)](https://vitejs.dev/) [![MongoDB](https://img.shields.io/badge/MongoDB-green?logo=mongodb)](https://www.mongodb.com/) [![Gemini AI](https://img.shields.io/badge/Gemini_AI-blueviolet?logo=google&logoColor=white)](https://ai.google.dev/)

**Một nền tảng web toàn diện, sử dụng sức mạnh của AI để trao quyền cho học sinh, sinh viên trong việc định hướng tương lai học tập và sự nghiệp.**

Dự án này là một trợ lý ảo cá nhân hóa, giúp người dùng khám phá các lựa chọn ngành học, nghề nghiệp phù hợp nhất với sở thích, năng lực và tính cách của bản thân, đồng thời cung cấp các công cụ mạnh mẽ như trình tạo CV thông minh.

![Giao diện ứng dụng](./demo.png "Demo ứng dụng Đại học Thông minh")

---

## ✨ Tính Năng Nổi Bật

Ứng dụng được xây dựng với mục tiêu cung cấp một trải nghiệm liền mạch và thông minh, bao gồm các tính năng chính:

### 🚀 Công Cụ Hướng Nghiệp AI

- **Trắc Nghiệm Tương Tác:** Một bài quiz động do AI dẫn dắt để khám phá tính cách, sở thích và đưa ra gợi ý nghề nghiệp chuyên sâu.
- **Gợi Ý Chuyên Ngành:** Khám phá các lộ trình học tập (VD: Công nghệ, Kinh doanh) và nhận đề xuất các ngành học phù hợp từ AI.
- **Tìm Kiếm Nghề Nghiệp:** Dựa trên các môn học yêu thích, AI sẽ phân tích và đề xuất các con đường sự nghiệp tiềm năng.
- **Khám Phá Trường Học:** Tích hợp Google Maps để tìm kiếm các trường Đại học, Cấp 3, Cấp 2 chất lượng cao ở khu vực lân cận.
- **Chatbot Trợ Lý:** Một trợ lý ảo luôn sẵn sàng trả lời các câu hỏi về hướng nghiệp, học tập, với lịch sử trò chuyện được lưu lại.

### 📄 Trình Tạo CV Thông Minh

- **Soạn Thảo Trực Quan:** Xây dựng CV chuyên nghiệp với giao diện chỉnh sửa và xem trước theo thời gian thực.
- **Hệ Thống Mẫu CV:** Lựa chọn từ các mẫu CV hiện đại, cổ điển có sẵn, hoặc tự tạo và chia sẻ mẫu của riêng bạn.
- **Tối Ưu Hóa bằng AI:**
  - Tự động viết đoạn tóm tắt (summary) ấn tượng.
  - Tối ưu hóa mô tả kinh nghiệm, dự án bằng ngôn ngữ chuyên nghiệp.
  - Viết lại toàn bộ CV chỉ với một cú nhấp chuột.
- **Xuất PDF:** Tải xuống CV của bạn dưới định dạng PDF chất lượng cao.

### 👤 Tính Năng Người Dùng

- **Xác Thực Toàn Diện:** Hỗ trợ đăng ký/đăng nhập bằng email, hoặc thông qua các mạng xã hội (Google, Facebook, GitHub).
- **Quản Lý Hồ Sơ:** Cập nhật thông tin cá nhân, thay đổi ảnh đại diện (tải lên từ máy hoặc chụp trực tiếp từ camera).
- **Lịch Sử Hoạt Động:** Xem lại tất cả các kết quả từ những lần khám phá và làm trắc nghiệm trước đây.
- **Cài Đặt Cá Nhân:** Tùy chỉnh giao diện Sáng/Tối (Light/Dark mode).

---

## 🛠️ Công Nghệ Sử Dụng

Dự án được xây dựng theo kiến trúc monorepo-style, tách biệt rõ ràng giữa Frontend và Backend.

| Lĩnh vực          | Công nghệ                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| **🤖 Backend**    | Node.js, Express, TypeScript, MongoDB (với Mongoose), Google Gemini API, JWT, Bcrypt, Multer, Sharp, Nodemailer |
| **🎨 Frontend**   | React 19, Vite, TypeScript, Tailwind CSS, React Router, Framer Motion, Lucide React, `jsPDF`, `html2canvas`     |
| **☁️ Deployment** | (Gợi ý: Vercel cho Frontend, Render/Heroku cho Backend, MongoDB Atlas cho Database)                             |

---

## 🚀 Cài Đặt và Khởi Chạy

Để chạy dự án trên máy cục bộ, bạn cần cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+), [npm](https://www.npmjs.com/) và có một instance [MongoDB](https://www.mongodb.com/) (local hoặc Atlas).

### 1. Tải Dự Án

```bash
git clone https://github.com/dangminhta/daihocthongminh.git
cd daihocthongminh
```

### 2. Cài Đặt Backend (`/server`)

a. **Di chuyển vào thư mục `server` và cài đặt dependencies:**

```bash
cd server
npm install
```

b. **Thiết lập biến môi trường:**

Tạo một file `.env` trong thư mục `server` và sử dụng mẫu dưới đây.

```env
# Kết nối Cơ sở dữ liệu
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>

# Bắt buộc: Chuỗi bí mật cho JWT (JSON Web Token)
JWT_SECRET=MOT_CHUOI_BI_MAT_NGAU_NHIEN_VA_PHUC_TAP

# Bắt buộc: API Key cho Google Gemini
API_KEY=YOUR_GEMINI_API_KEY_HERE

# URL của Frontend để xử lý callback từ OAuth
CLIENT_URL=http://localhost:3000

# (Tùy chọn) Cấu hình gửi Email (cho chức năng quên mật khẩu)
# Sử dụng Gmail, bạn cần tạo "Mật khẩu ứng dụng" (App Password)
# Hướng dẫn: https://support.google.com/accounts/answer/185833
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# --- (Tùy chọn) Cấu hình OAuth 2.0 cho Đăng nhập Mạng xã hội ---
# Google (tạo tại https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Facebook (tạo tại https://developers.facebook.com/apps/)
FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
FACEBOOK_APP_SECRET=YOUR_FACEBOOK_APP_SECRET

# GitHub (tạo tại https://github.com/settings/developers)
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
```

> **Quan trọng:** Với OAuth, bạn cần cấu hình URL callback trên trang của nhà cung cấp là `http://<your-server-address>/api/auth/<provider>/callback`. Ví dụ: `http://localhost:5000/api/auth/google/callback`.

c. **Chạy server:**

```bash
npm start
```

Server sẽ chạy trên cổng `5000` tại địa chỉ `http://localhost:5000`.

### 3. Cài Đặt Frontend (`/client`)

a. **Mở một terminal mới, di chuyển vào thư mục `client` và cài đặt dependencies:**

```bash
cd client
npm install
```

b. **Thiết lập biến môi trường:**
Tạo một file `.env` trong thư mục `client` và thêm vào API key của bạn.

```env
# API Key này dùng cho các tính năng AI chạy trực tiếp trên client (ví dụ: "Bạn có biết?")
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

c. **Chạy client:**

```bash
npm run dev
```

Ứng dụng sẽ có sẵn tại một địa chỉ do Vite cung cấp (thường là `http://localhost:3000`). Vite đã được cấu hình proxy để tự động chuyển tiếp các yêu cầu `/api` đến server backend.

---

## 📋 Biến Môi Trường

Bảng tổng hợp tất cả các biến môi trường cần thiết.

| Biến                   | Vị trí        | Bắt buộc | Mô tả                                                                      |
| ---------------------- | ------------- | -------- | -------------------------------------------------------------------------- |
| `MONGO_URI`            | `server/.env` | **Có**   | Chuỗi kết nối đến cơ sở dữ liệu MongoDB.                                   |
| `JWT_SECRET`           | `server/.env` | **Có**   | Chuỗi bí mật để ký và xác thực JSON Web Tokens.                            |
| `API_KEY`              | `server/.env` | **Có**   | API Key cho Google Gemini, sử dụng cho các tác vụ AI chính ở backend.      |
| `CLIENT_URL`           | `server/.env` | **Có**   | URL của ứng dụng frontend, dùng cho việc redirect sau khi đăng nhập OAuth. |
| `EMAIL_USER`           | `server/.env` | Không    | Tài khoản email dùng để gửi mail (ví dụ: quên mật khẩu).                   |
| `EMAIL_PASS`           | `server/.env` | Không    | Mật khẩu ứng dụng cho tài khoản email trên.                                |
| `GOOGLE_CLIENT_ID`     | `server/.env` | Không    | Client ID cho đăng nhập bằng Google.                                       |
| `GOOGLE_CLIENT_SECRET` | `server/.env` | Không    | Client Secret cho đăng nhập bằng Google.                                   |
| `FACEBOOK_APP_ID`      | `server/.env` | Không    | App ID cho đăng nhập bằng Facebook.                                        |
| `FACEBOOK_APP_SECRET`  | `server/.env` | Không    | App Secret cho đăng nhập bằng Facebook.                                    |
| `GITHUB_CLIENT_ID`     | `server/.env` | Không    | Client ID cho đăng nhập bằng GitHub.                                       |
| `GITHUB_CLIENT_SECRET` | `server/.env` | Không    | Client Secret cho đăng nhập bằng GitHub.                                   |
| `VITE_GEMINI_API_KEY`  | `client/.env` | **Có**   | API Key cho Gemini, dùng cho các tác vụ AI nhỏ chạy phía client.           |

---

## 🤔 Gỡ Lỗi Thường Gặp

- **Lỗi `401 Unauthorized`**: Đảm bảo bạn đã tạo file `.env` trong thư mục `server` và đã cung cấp một giá trị hợp lệ cho `JWT_SECRET`.
- **Lỗi kết nối MongoDB**: Kiểm tra lại chuỗi `MONGO_URI` trong file `server/.env`. Đảm bảo IP của bạn đã được thêm vào danh sách cho phép truy cập trên MongoDB Atlas.
- **Lỗi API Key**: Đảm bảo bạn đã cung cấp `API_KEY` trong `server/.env` và `VITE_GEMINI_API_KEY` trong `client/.env`.
- **Lỗi Đăng nhập Mạng xã hội**: Kiểm tra lại `CLIENT_ID`, `CLIENT_SECRET` và `CLIENT_URL` trong `server/.env`. Đảm bảo URL callback bạn cấu hình trên trang của nhà cung cấp (Google, Facebook, GitHub) là chính xác.
- **Lỗi gửi Email**: Đảm bảo `EMAIL_USER` và `EMAIL_PASS` trong `server/.env` là chính xác. Nếu dùng Gmail, `EMAIL_PASS` phải là một "Mật khẩu ứng dụng" (App Password), không phải mật khẩu đăng nhập Gmail của bạn.

---

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi sự đóng góp! Vui lòng tạo một `Pull Request` hoặc `Issue` trên GitHub để thảo luận về các thay đổi bạn muốn thực hiện.

1.  Fork a repo
2.  Tạo một nhánh mới (`git checkout -b feature/AmazingFeature`)
3.  Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`)
4.  Push lên nhánh (`git push origin feature/AmazingFeature`)
5.  Mở một Pull Request

---

## 📄 Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT.

---

## 📧 Liên Hệ

Được tạo bởi team **Anh em Sài Gòn - Đội thi Hackathon HCMUTE**
Link dự án: [https://github.com/dangminhtai/daihocthongminh](https://github.com/dangminhtai/daihocthongminh)

### Các thành viên trong đội

#### 1. Đặng Minh Tài

<p align="center">
  <a href="mailto:dmt826321@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white&style=for-the-badge"/></a>
  <a href="https://facebook.com/tamidanopro"><img src="https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white&style=for-the-badge"/></a>
  <a href="https://github.com/dangminhtai"><img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge"/></a>
</p>

#### 2. Trần Minh Trọng Nhân

<p align="center">
  <a href="mailto:tranminhtrongnhan22072005@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white&style=for-the-badge"/></a>
  <a href="facebook.com/tran.nhan.407057"><img src="https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white&style=for-the-badge"/></a>
  <a href="https://github.com/sibula227"><img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge"/></a>
</p>

#### 3. Nguyễn Thế Tân

<p align="center">
  <a href="mailto:23110152@student.hcmute.edu.vn"><img src="https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white&style=for-the-badge"/></a>
  <a href="https://www.facebook.com/tan.nguyenthe.52090"><img src="https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white&style=for-the-badge"/></a>
  <a href="https://github.com/iHateIT665"><img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge"/></a>
</p>

#### 4. Lưu Quang Tiến

<p align="center">
  <a href="mailto:23110157@student.hcmute.edu.vn"><img src="https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white&style=for-the-badge"/></a>
  <a href="https://web.facebook.com/profile.php?id=100082150637852&locale=vi_VN"><img src="https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white&style=for-the-badge"/></a>
  <a href="https://github.com/LuuQuangTien"><img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge"/></a>
</p>

> Thả 1 star ⭐ nếu cảm thấy dự án này hữu ích nhé!
