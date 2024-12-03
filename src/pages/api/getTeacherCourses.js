// getteachercourses.js
import { getConnection } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query; // user_id parametresini alıyoruz

        const connection = await getConnection();

        try {
            // user_id'ye göre öğretim elemanının derslerini çekme
            const query = `
                SELECT
                    oe.ogretim_elemani_id,
                    oe.unvan AS ogretim_elemanı,
                    d.ders_id,
                    d.ders_kodu,
                    d.ders_adı,
                    ds.derslik_adi,
                    qk.qr_kod_id -- QR Kod ID'yi buraya ekledik
                FROM
                    ogretim_elemanlari oe
                        JOIN dersler d ON oe.ogretim_elemani_id = d.ogretim_elemani_id
                        LEFT JOIN derslikler ds ON d.derslik_id = ds.derslik_id
                        LEFT JOIN qr_kodlar qk ON ds.derslik_id = qk.derslik_id -- Derslik ile QR kodları eşleştiriyoruz
                WHERE
                    oe.user_id = ?;
            `;

            const [rows] = await connection.execute(query, [userId]);

            res.status(200).json(rows);
        } catch (error) {
            console.error('Veritabanı hatası:', error);
            res.status(500).json({ error: 'Dersler alınırken bir hata oluştu' });
        } finally {
            connection.end();
        }
    } else {
        res.status(405).json({ message: 'Yalnızca GET isteklerine izin veriliyor' });
    }
}
