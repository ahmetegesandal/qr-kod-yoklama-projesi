import { getConnection } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { dersId } = req.query;

        if (!dersId) {
            return res.status(400).json({ error: 'Ders ID eksik.' });
        }

        const connection = await getConnection();

        try {
            const [rows] = await connection.query(
                `SELECT 1 FROM opened_rollcall 
                 WHERE ders_id = ? 
                   AND durum = 'acik' 
                   AND tarih = CURDATE()
                   AND CURTIME() BETWEEN baslangic_saati AND bitis_saati`,
                [dersId]
            );

            res.status(200).json({
                isRollcallStarted: rows.length > 0,
            });
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
