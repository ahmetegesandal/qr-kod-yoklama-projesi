// pages/api/checkActiveClass.js

import { getConnection } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        // Kullanıcı ID'sinin doğruluğunu kontrol et
        if (!userId) {
            return res.status(400).json({ error: 'Kullanıcı ID eksik' });
        }

        const connection = await getConnection();

        try {
            // Belirli bir kullanıcıya ait güncel saat diliminde devam eden dersi sorgula
            const [rows] = await connection.query(
                `SELECT d.ders_id, d.ders_adı, sc.başlangıç_saati, sc.bitiş_saati
                 FROM dersler d
                          JOIN student_courses sc ON d.ders_id = sc.ders_id
                 WHERE sc.id = ?  -- Kullanıcı ID'si ile filtrele
                   AND sc.gün = DAYNAME(NOW())  -- Gün filtresi (VARCHAR karşılaştırması)
                   AND CURTIME() BETWEEN sc.başlangıç_saati AND sc.bitiş_saati;  -- Saat aralığı kontrolü`,
                [userId]
            );

            if (rows.length > 0) {
                // Eğer öğrenciye ait şu anda aktif bir ders varsa, ders bilgilerini döndür
                res.status(200).json({
                    hasClass: true,
                    classDetails: rows[0],  // İlk eşleşen dersi döndür
                });
            } else {
                // Aktif ders yoksa bilgilendirme mesajı gönder
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
