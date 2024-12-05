import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const db = await getConnection(); // Veritabanı bağlantısını al
            const [rows] = await db.query('SELECT * FROM users');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            res.status(500).json({ message: 'Veritabanı hatası' });
        }
    } else if (req.method === 'POST') {
        const { name, email } = req.body;
        try {
            const db = await getConnection();
            const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
            res.status(201).json({ id: result.insertId, name, email });
        } catch (error) {
            console.error('Veri ekleme hatası:', error);
            res.status(500).json({ message: 'Veritabanı hatası' });
        }
    } else {
        res.status(405).json({ message: 'Bu metod desteklenmiyor' });
    }
}
