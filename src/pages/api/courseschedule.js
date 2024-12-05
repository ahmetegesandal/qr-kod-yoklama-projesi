// pages/api/courseschedule.js

import { getConnection } from '@/lib/db'; // Veritabanı bağlantınızı ayarlayın

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const connection = await getConnection(); // Bağlantıyı alın

        // Kullanıcı bilgilerini almak için sorgu
        const [userResult] = await connection.query(
            `SELECT role FROM users WHERE id = ?`,
            [id]
        );

        const userRole = userResult[0]?.role;

        let query;
        let queryParams;

        if (userRole === 'admin') {
            // Kullanıcı admin ise, öğretim elemanı derslerini getirin
            query = `
                SELECT
                    oe.ogretim_elemani_id,              -- Öğretim elemanı ID'si
                    dc.gün,                              -- Ders günü
                    dc.başlangıç_saati,                 -- Dersin başlangıç saati
                    dc.bitiş_saati,                     -- Dersin bitiş saati
                    d.ders_kodu,                        -- Ders kodu
                    d.ders_adı,                         -- Ders adı
                    oe.unvan AS öğretim_elemanı,
                    ds.derslik_adi AS derslik           -- Derslik adı
                FROM
                    ogretim_elemanlari oe                -- Öğretim elemanları tablosu
                        JOIN dersler d ON oe.ogretim_elemani_id = d.ogretim_elemani_id  -- Dersler tablosu
                        JOIN student_courses dc ON d.ders_id = dc.ders_id  -- Öğrenci ders kaydı
                        JOIN derslikler ds ON dc.derslik_id = ds.derslik_id  -- Derslikler tablosu
                WHERE
                    oe.user_id = ?                        -- Öğretim elemanının user_id'si ile eşleştir
                ORDER BY
                    FIELD(dc.gün, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
            `;
            queryParams = [id]; // Admin kullanıcı için öğretim elemanının user_id'sini kullanıyoruz
        } else {
            // Öğrenci ise, kendi ders programını getir
            query = `
                SELECT
                    u.id AS öğrenci_id,
                    u.bolum_id,
                    dc.gün,
                    dc.başlangıç_saati,
                    dc.bitiş_saati,
                    d.ders_kodu,
                    d.ders_adı,
                    de.unvan AS öğretim_elemanı,
                    ds.derslik_adi AS derslik
                FROM
                    users u
                    JOIN student_courses dc ON u.id = dc.id
                    JOIN dersler d ON dc.ders_id = d.ders_id
                    JOIN ogretim_elemanlari de ON d.ogretim_elemani_id = de.ogretim_elemani_id
                    JOIN derslikler ds ON dc.derslik_id = ds.derslik_id
                WHERE
                    u.id = ?
                ORDER BY
                    FIELD(dc.gün, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
            `;
            queryParams = [id];
        }

        const [results] = await connection.query(query, queryParams);

        res.status(200).json(results);
    } catch (error) {
        console.error('Error details:', error); // Hata detaylarını yazdır
        res.status(500).json({ error: 'Veri alınırken bir hata oluştu.' });
    }
}
