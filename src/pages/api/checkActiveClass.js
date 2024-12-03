import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Kullanıcı ID eksik' });
        }

        const connection = await getConnection();

        try {
            // Kullanıcının şu anda aktif olan tüm derslerini ve oturumlarını getir
            const [rows] = await connection.query(
                `SELECT d.ders_id, d.ders_adı, sc.başlangıç_saati, sc.bitiş_saati, sc.gün, dl.derslik_adi
                 FROM dersler d
                          JOIN student_courses sc ON d.ders_id = sc.ders_id
                          LEFT JOIN derslikler dl ON d.derslik_id = dl.derslik_id
                 WHERE sc.id = ?
                   AND sc.gün = DAYNAME(NOW()) -- Şu anki gün
                   AND CURTIME() BETWEEN sc.başlangıç_saati AND sc.bitiş_saati`,
                [userId]
            );

            if (rows.length > 0) {
                res.status(200).json({
                    hasClass: true,
                    classDetails: rows, // Tüm aktif dersleri döndür
                });
            } else {
                res.status(200).json({
                    hasClass: false,
                    message: 'Şu anda kullanıcıya ait bir ders bulunmamaktadır.',
                });
            }
        } catch (error) {
            console.error('Veritabanı hatası:', error);
            res.status(500).json({ error: 'Sorgu sırasında bir hata oluştu.', details: error.message });
        } finally {
            connection.release();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
