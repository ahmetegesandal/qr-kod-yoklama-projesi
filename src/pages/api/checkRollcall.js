import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { dersId } = req.query;

        if (!dersId) {
            return res.status(400).json({ error: 'Ders ID eksik.' });
        }

        const connection = await getConnection();

        try {
            // Belirtilen ders için açık olan yoklama oturumlarını getir
            const [rows] = await connection.query(
                `SELECT orc.roll_call_id, orc.baslangic_saati, orc.bitis_saati
                 FROM opened_rollcall orc
                 WHERE orc.ders_id = ?
                   AND orc.durum = 'acik'
                   AND orc.tarih = CURDATE()
                   AND CURTIME() BETWEEN orc.baslangic_saati AND orc.bitis_saati`,
                [dersId]
            );

            if (rows.length > 0) {
                res.status(200).json({
                    isRollcallStarted: true,
                    activeRollcalls: rows, // Aktif oturumların detaylarını döndür
                });
            } else {
                res.status(200).json({
                    isRollcallStarted: false,
                    message: 'Bu ders için açık bir yoklama bulunmamaktadır.',
                });
            }
        } catch (error) {
            console.error('Veritabanı hatası:', error);
            res.status(500).json({ error: 'Yoklama kontrolü sırasında bir hata oluştu.', details: error.message });
        } finally {
            connection.release();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
