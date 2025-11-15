import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Login, ILogin } from '../models/login.model';
import { User } from '../models/user.model';
import { generateUniqueUserId, generateDefaultAvatar } from '../utils/user.utils';
import { generateOTP, sendPasswordResetEmail } from '../utils/auth.utils';
dotenv.config();
const router = express.Router();

// --- AUTHENTICATION HELPER ---
const handleSocialLogin = async (
    provider: 'google' | 'facebook' | 'github',
    profile: { id: string; email?: string; name: string; avatarUrl?: string },
    res: Response
) => {
    try {
        const providerIdField = `${provider}Id` as keyof ILogin;

        let login = await Login.findOne({ [providerIdField]: profile.id });

        if (!login && profile.email) {
            login = await Login.findOne({ gmail: profile.email });
        }

        let user;
        if (login) { // User exists
            if (!login[providerIdField]) {
                (login as any)[providerIdField] = profile.id;
                await login.save();
            }
            user = await User.findOne({ loginID: login._id });
            if (!user) throw new Error("Tài khoản đăng nhập tồn tại nhưng không tìm thấy hồ sơ người dùng.");
        } else { // New user
            const newLogin = new Login({
                gmail: profile.email || `${profile.id}@${provider}.placeholder.com`, // Create a placeholder email if not provided
                [providerIdField]: profile.id,
            });
            const savedLogin = await newLogin.save();

            const userId = await generateUniqueUserId();
            const avatarUrl = profile.avatarUrl || generateDefaultAvatar(profile.name);
            const newUser = new User({
                loginID: savedLogin._id,
                fullName: profile.name,
                userId,
                avatarUrl,
                role: 'high_school_student', // Default role for social sign-ups
            });
            user = await newUser.save();
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            mssv: user.mssv,
            userId: user.userId,
            avatarUrl: user.avatarUrl,
            role: user.role
        };

        // Send data back to the popup window to be relayed to the main app
        res.send(`
            <script>
                window.opener.postMessage({
                    token: "${token}",
                    user: ${JSON.stringify(userResponse)}
                }, "${process.env.CLIENT_URL}");
                window.close();
            </script>
            <p>Xác thực thành công! Cửa sổ này sẽ tự động đóng.</p>
        `);
    } catch (error) {
        console.error(`Lỗi đăng nhập ${provider}:`, error);
        res.status(500).send(`
            <script>
                window.opener.postMessage({ error: "Lỗi server khi đăng nhập bằng ${provider}." }, "${process.env.CLIENT_URL}");
                window.close();
            </script>
            <p>Đã xảy ra lỗi. Vui lòng thử lại.</p>
        `);
    }
};


// --- LOCAL AUTH ---
// Endpoint: POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { fullName, mssv, gmail, password, role } = req.body;

        if (!fullName || !gmail || !password || !role) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
        }
        if (role === 'student' && !mssv) {
            return res.status(400).json({ message: 'Vui lòng cung cấp Mã số sinh viên.' });
        }
        if (!['student', 'high_school_student'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
        }

        const orQuery: any[] = [{ gmail }];
        if (role === 'student' && mssv) {
            orQuery.push({ mssv });
        }
        const existingLogin = await Login.findOne({ $or: orQuery });

        if (existingLogin) {
            const message = existingLogin.gmail === gmail ? 'Gmail đã tồn tại.' : 'MSSV đã tồn tại.';
            return res.status(409).json({ message });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
       const newLogin = new Login({ 
        gmail, 
        mssv: role === 'student' ? mssv : undefined, 
        password: hashedPassword 
    });
        const savedLogin = await newLogin.save();

        const userId = await generateUniqueUserId();
        const avatarUrl = generateDefaultAvatar(fullName);
        const newUser = new User({
            loginID: savedLogin._id,
            fullName,
            mssv: role === 'student' ? mssv : undefined,
            userId,
            avatarUrl,
            role
        });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
    }
});
// Endpoint: POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { gmail, password } = req.body;
        if (!gmail || !password) {
            return res.status(400).json({ message: 'Vui lòng điền gmail và mật khẩu.' });
        }
        const loginInfo = await Login.findOne({ gmail });
        if (!loginInfo || !loginInfo.password) {
            return res.status(401).json({ message: 'Gmail hoặc mật khẩu không đúng.' });
        }
        const isMatch = await bcrypt.compare(password, loginInfo.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Gmail hoặc mật khẩu không đúng.' });
        }
        const user = await User.findOne({ loginID: loginInfo._id });
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy tài khoản người dùng tương ứng.' });
        }
        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            mssv: user.mssv,
            userId: user.userId,
            avatarUrl: user.avatarUrl,
            role: user.role
        };
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
});


// --- PASSWORD RESET ---
router.post('/forgot-password', async (req, res) => { /* ... existing code ... */ });
router.post('/reset-password', async (req, res) => { /* ... existing code ... */ });


// --- GOOGLE OAUTH ---
router.get('/google', (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${req.protocol}://${req.get('host')}/api/auth/google/callback&response_type=code&scope=profile email`;
    res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${req.protocol}://${req.get('host')}/api/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description);

        const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        });
        const profileData = await profileRes.json();

        await handleSocialLogin('google', {
            id: profileData.id,
            email: profileData.email,
            name: profileData.name,
            avatarUrl: profileData.picture
        }, res);

    } catch (error) {
        console.error("Google OAuth Error:", error);
        res.status(500).send("Lỗi xác thực Google.");
    }
});


// --- FACEBOOK OAUTH ---
router.get('/facebook', (req, res) => {
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${req.protocol}://${req.get('host')}/api/auth/facebook/callback&scope=email,public_profile`;
    res.redirect(url);
});

router.get('/facebook/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${req.protocol}://${req.get('host')}/api/auth/facebook/callback&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`);
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error.message);

        const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`);
        const profileData = await profileRes.json();

        await handleSocialLogin('facebook', {
            id: profileData.id,
            email: profileData.email,
            name: profileData.name,
            avatarUrl: profileData.picture?.data?.url
        }, res);

    } catch (error) {
        console.error("Facebook OAuth Error:", error);
        res.status(500).send("Lỗi xác thực Facebook.");
    }
});


// --- GITHUB OAUTH ---
router.get('/github', (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${req.protocol}://${req.get('host')}/api/auth/github/callback&scope=user:email`;
    res.redirect(url);
});

router.get('/github/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description);

        const profileRes = await fetch('https://api.github.com/user', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        });
        const profileData = await profileRes.json();

        let userEmail = profileData.email;
        if (!userEmail) {
            const emailsRes = await fetch('https://api.github.com/user/emails', {
                headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
            });
            const emailsData = await emailsRes.json();
            const primaryEmail = emailsData.find((e: any) => e.primary);
            userEmail = primaryEmail?.email;
        }

        await handleSocialLogin('github', {
            id: profileData.id.toString(),
            email: userEmail,
            name: profileData.name || profileData.login,
            avatarUrl: profileData.avatar_url
        }, res);

    } catch (error) {
        console.error("GitHub OAuth Error:", error);
        res.status(500).send("Lỗi xác thực GitHub.");
    }
});


export default router;