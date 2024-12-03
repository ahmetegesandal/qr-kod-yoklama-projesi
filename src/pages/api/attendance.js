import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { qr_kod_icerik, users_id, ders_id } = req.body;

        if (!qr_kod_icerik || !users_id || !ders_id) {
            return res.status(400).json({ error: 'Eksik alanlar.' });
        }

        const connection = await getConnection();

        try {
            // Aynı kişi, ders ve tarih için yoklama olup olmadığını kontrol et
            const [existingRows] = await connection.query(
                `SELECT yoklama_id
                 FROM yoklamalar
                 WHERE user_id = ? AND ders_id = ? AND DATE(tarih) = CURDATE()`,
                [users_id, ders_id]
            );

            if (existingRows.length > 0) {
                return res.status(409).json({ error: 'Bu ders için zaten bugün yoklama kaydedilmiş.' });
            }

            // QR kodun ve dersin geçerliliğini kontrol et
            const [rows] = await connection.query(
                `SELECT dl.qr_kod_id
                 FROM opened_rollcall orc
                          JOIN dersler d ON orc.ders_id = d.ders_id
                          JOIN derslikler dl ON d.derslik_id = dl.derslik_id
                 WHERE orc.ders_id = ?
                   AND dl.derslik_adi = ?
                   AND orc.durum = 'acik'
                   AND orc.tarih = CURDATE()
                   AND CURTIME() BETWEEN orc.baslangic_saati AND orc.bitis_saati`,
                [ders_id, qr_kod_icerik]
            );

            if (rows.length === 0) {
                return res.status(403).json({ error: 'Geçersiz QR kod veya ders eşleşmesi.' });
            }

            // Yoklama kaydını ekle
            const [result] = await connection.query(
                `INSERT INTO yoklamalar (user_id, ders_id, tarih, durum)
                 VALUES (?, ?, NOW(), 'var')`,
                [users_id, ders_id]
            );

            return res.status(201).json({ message: 'Yoklama kaydı başarıyla yapıldı.', yoklama_id: result.insertId });
        } catch (error) {
            console.error('Veri eklenirken hata:', error);
            res.status(500).json({ error: 'Yoklama kaydı sırasında bir hata oluştu.', details: error.message });
        } finally {
            await connection.release();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
