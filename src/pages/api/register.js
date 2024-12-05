import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Fotoğraf yükleme ayarları
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/images/uploads/profile_pictures'; // Yükleme dizini
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir); // Dizin yoksa oluştur
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const studentNumber = req.body.studentNumber; // Öğrenci numarasını al
        const ext = path.extname(file.originalname); // Orijinal dosya uzantısını al
        cb(null, `user_${studentNumber}${ext}`); // Dosya adını sadece user_ ile değiştir
    },
});

const upload = multer({ storage });

export const config = {
    api: {
        bodyParser: false, // JSON yerine form verisi kullanacağız
    },
};

// API route handler
export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Multer'ı kullanarak dosyayı al
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Dosya yüklenirken bir hata oluştu.', error: err });
            }

            const { username, password, role, studentNumber } = req.body; // studentNumber'ı alıyoruz

            const connection = await getConnection();

            try {
                // Gelen isteğin rolü kontrol ediliyor
                if (role !== 'admin') {
                    return res.status(403).json({ message: 'Sadece admin kullanıcıları yeni kullanıcı oluşturabilir.' });
                }

                // Aynı kullanıcı adıyla başka bir kullanıcı var mı kontrol et
                const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

                if (rows.length > 0) {
                    return res.status(409).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
                }

                // Şifreyi bcrypt ile hashle
                const hashedPassword = await bcrypt.hash(password, 10);

                // Yeni kullanıcıyı veritabanına ekle
                const photoPath = req.file ? req.file.filename : null; // Fotoğraf adını al
                await connection.execute(
                    'INSERT INTO users (username, password, studentNumber, photo) VALUES (?, ?, ?, ?)',
                    [username, hashedPassword, studentNumber, photoPath] // Fotoğraf adını veritabanına ekle
                );

                res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!' });
            } catch (error) {
                res.status(500).json({ message: 'Bir hata oluştu.', error });
            } finally {
                await connection.end();
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
