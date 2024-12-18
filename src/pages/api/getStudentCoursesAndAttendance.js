import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: "Kullanıcı ID'si gerekli" });
    }

    try {
        const connection = await getConnection();
        console.log("Veritabanı bağlantısı başarılı.");

        const [enrichedData] = await connection.execute(
            `SELECT DISTINCT
                 sc.ders_id,
                 d.ders_adı AS ders_adı,
                 orc.tarih AS yoklama_tarihi,
                 orc.baslangic_saati,
                 orc.bitis_saati,
                 CASE
                     WHEN y.durum = 'var' THEN 'var'
                     ELSE 'yok'
                     END AS katılım_durumu
             FROM
                 student_courses AS sc
                     INNER JOIN dersler AS d ON sc.ders_id = d.ders_id
                     LEFT JOIN opened_rollcall AS orc ON sc.ders_id = orc.ders_id
                     LEFT JOIN yoklamalar AS y
                               ON y.ders_id = sc.ders_id
                                   AND y.user_id = ?
                                   AND y.tarih = orc.tarih
                                   AND y.baslangic_saati = orc.baslangic_saati
             WHERE
                 sc.id = ?
             ORDER BY
                 orc.tarih DESC, orc.baslangic_saati ASC`,
            [userId, userId]
        );

        console.log("Enriched Data:", enrichedData);
        await connection.end();

        return res.status(200).json({ enrichedData });
    } catch (error) {
        console.error("API Hatası:", error);
        return res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
}
