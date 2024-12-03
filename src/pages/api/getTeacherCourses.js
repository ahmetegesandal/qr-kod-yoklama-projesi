import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        const connection = await getConnection();

        try {
            const query = `
                SELECT
                    oe.ogretim_elemani_id,
                    oe.unvan AS ogretim_elemanı,
                    d.ders_id,
                    d.ders_kodu,
                    d.ders_adı,
                    ds.derslik_adi,
                    qk.qr_kod_id,
                    sc.başlangıç_saati,
                    sc.bitiş_saati
                FROM
                    ogretim_elemanlari oe
                        JOIN dersler d ON oe.ogretim_elemani_id = d.ogretim_elemani_id
                        LEFT JOIN derslikler ds ON d.derslik_id = ds.derslik_id
                        LEFT JOIN qr_kodlar qk ON ds.derslik_id = qk.derslik_id
                        LEFT JOIN student_courses sc ON d.ders_id = sc.ders_id

                WHERE
                    oe.user_id = ?;
            `;

            const [rows] = await connection.execute(query, [userId]);

            res.status(200).json(rows);
        } catch (error) {
            console.error('Veritabanı hatası:', error);
            res.status(500).json({ error: 'Dersler alınırken bir hata oluştu' });
        } finally {
            if (connection) await connection.end();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: 'Yalnızca GET isteklerine izin veriliyor' });
    }
}
