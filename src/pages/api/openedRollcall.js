import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { ders_id, users_id, tarih, durum, baslangic_saati, bitis_saati, qr_kod_id } = req.body;

        const connection = await getConnection();

        try {
            // Aynı yoklamanın daha önce açılıp açılmadığını kontrol et
            const checkQuery = `
                SELECT roll_call_id
                FROM opened_rollcall
                WHERE ders_id = ? AND tarih = ? AND qr_kod_id = ?
            `;
            const [existingRows] = await connection.execute(checkQuery, [ders_id, tarih, qr_kod_id]);

            if (existingRows.length > 0) {
                return res.status(400).json({ error: 'Bu ders için yoklama zaten başlatılmış.' });
            }

            // Yoklama ekle
            const query = `
                INSERT INTO opened_rollcall (ders_id, users_id, tarih, durum, baslangic_saati, bitis_saati, qr_kod_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await connection.execute(query, [ders_id, users_id, tarih, durum, baslangic_saati, bitis_saati, qr_kod_id]);

            res.status(200).json({ message: 'Yoklama başarıyla eklendi', id: result.insertId });
        } catch (error) {
            console.error('Veritabanı hatası:', error.message);
            res.status(500).json({ error: 'Yoklama eklenirken bir hata oluştu' });
        } finally {
            connection.end();
        }
    } else {
        res.status(405).json({ message: 'Yalnızca POST isteklerine izin veriliyor' });
    }
}
