import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        const connection = await getConnection();

        try {
            const query = `
                SELECT
                    d.ders_id,
                    d.ders_kodu,
                    d.ders_adı,
                    ds.derslik_adi,
                    oe.unvan AS ogretim_elemanı,
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

            // Backend'de verileri gruplama
            const groupedData = rows.reduce((acc, row) => {
                const ders = acc.find((d) => d.ders_id === row.ders_id);
                if (ders) {
                    ders.oturumlar.push({
                        başlangıç_saati: row.başlangıç_saati,
                        bitiş_saati: row.bitiş_saati,
                    });
                } else {
                    acc.push({
                        ders_id: row.ders_id,
                        ders_kodu: row.ders_kodu,
                        ders_adı: row.ders_adı,
                        derslik_adi: row.derslik_adi,
                        ogretim_elemanı: row.ogretim_elemanı,
                        qr_kod_id: row.qr_kod_id,
                        oturumlar: row.başlangıç_saati
                            ? [
                                {
                                    başlangıç_saati: row.başlangıç_saati,
                                    bitiş_saati: row.bitiş_saati,
                                },
                            ]
                            : [],
                    });
                }
                return acc;
            }, []);

            res.status(200).json(groupedData);
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
