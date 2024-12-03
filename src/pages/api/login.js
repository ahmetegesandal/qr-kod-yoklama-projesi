import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // Girdi doğrulaması
        if (!username || !password) {
            return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir.' });
        }

        const connection = await getConnection();

        try {
            // Kullanıcıyı veritabanından çek
            const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
            }

            const user = rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Geçersiz şifre.' });
            }

            // Admin kontrolü
            const isAdmin = user.role === 'admin';

            // JWT oluşturma
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Başarılı giriş yanıtı
            res.status(200).json({
                message: 'Giriş başarılı!',
                token,
                id: user.id,
                username: user.username,
                role: user.role, // Rolü yanıt olarak döndürüyoruz
                isAdmin // Admin olup olmadığını belirt
            });
        } catch (error) {
            console.error('Veritabanı hatası:', error); // Hata günlüğü
            res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
        } finally {
            // Bağlantıyı kapat
            await connection.end();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
