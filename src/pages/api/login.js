import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password, recaptchaToken } = req.body;

        if (!username || !password || !recaptchaToken) {
            return res.status(400).json({ message: 'Eksik alanlar.' });
        }

        // Google reCAPTCHA doğrulama
        try {
            const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `secret=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe&response=${recaptchaToken}`,
            });
            const recaptchaData = await recaptchaRes.json();

            if (!recaptchaData.success) {
                return res.status(400).json({ message: 'reCAPTCHA doğrulaması başarısız.' });
            }
        } catch (error) {
            console.error('reCAPTCHA Hatası:', error);
            return res.status(500).json({ message: 'reCAPTCHA doğrulama hatası.' });
        }

        const connection = await getConnection();

        try {
            // Kullanıcı doğrulama ve token işlemleri...
            const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
            }

            const user = rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Geçersiz şifre.' });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Giriş başarılı!', token });
        } catch (error) {
            console.error('Veritabanı hatası:', error);
            res.status(500).json({ message: 'Bir hata oluştu.' });
        } finally {
            await connection.end();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
