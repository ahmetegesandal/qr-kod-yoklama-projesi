import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const connection = await getConnection();

        try {
            // Bildirimi okundu olarak işaretle
            const [result] = await connection.query(
                'UPDATE notifications SET is_read = ? WHERE id = ?',
                [true, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Bildirim bulunamadı' });
            }

            res.status(200).json({ message: 'Bildirim okundu olarak işaretlendi' });
        } catch (error) {
            console.error('Database error:', error.message);
            res.status(500).json({ message: error.message });
        } finally {
            await connection.end();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
