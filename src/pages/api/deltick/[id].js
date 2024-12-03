import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    const { id, role } = req.query; // Silinecek ticket ID ve rol bilgisi

    if (req.method === 'DELETE') {
        // Role kontrolü
        if (!role || role !== 'admin') {
            return res.status(403).json({ message: "Sadece adminler ticket silebilir." });
        }

        try {
            // Ticket silme işlemi
            const connection = await getConnection();
            const [result] = await connection.query('DELETE FROM tickets WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Silinecek ticket bulunamadı." });
            }

            await connection.end();
            res.status(200).json({ message: 'Ticket başarıyla silindi.' });
        } catch (error) {
            console.error('Hata:', error.message);
            res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
