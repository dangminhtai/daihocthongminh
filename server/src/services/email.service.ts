import nodemailer from 'nodemailer';

// --- Kiểm tra biến môi trường cho email ---
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
    console.warn("CẢNH BÁO: Biến môi trường EMAIL_USER hoặc EMAIL_PASS chưa được thiết lập. Chức năng gửi email sẽ không hoạt động.");
}
// --- Kết thúc kiểm tra ---

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

/**
 * Sends a password reset OTP email to a user.
 * @param to The recipient's email address.
 * @param otp The 6-digit one-time password.
 */
export const sendPasswordResetEmail = async (to: string, otp: string): Promise<void> => {
    if (!emailUser || !emailPass) {
        throw new Error('Dịch vụ email chưa được cấu hình trên server.');
    }

    const mailOptions = {
        from: `"Đại học Thông minh" <${emailUser}>`,
        to: to,
        subject: 'Yêu cầu đặt lại mật khẩu | Đại học Thông minh',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4A5568;">Yêu cầu đặt lại mật khẩu</h2>
                <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Mã xác thực của bạn là:</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #4299E1; margin: 20px 0;">${otp}</p>
                <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #718096;">Trân trọng,<br/>Đội ngũ Đại học Thông minh</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email đặt lại mật khẩu đã được gửi tới: ${to}`);
    } catch (error) {
        console.error(`Lỗi khi gửi email tới ${to}:`, error);
        throw new Error('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
    }
};
