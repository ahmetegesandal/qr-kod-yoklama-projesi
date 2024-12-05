import { getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        // Authorization başlığından token'ı al
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        let userId, role;

        try {
            // JWT'yi doğrula
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId; // Kullanıcı kimliğini al
            role = decoded.role; // Kullanıcı rolünü al
            console.log('Decoded User ID:', userId); // Logla
            console.log('Decoded User Role:', role); // Logla
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        const connection = await getConnection();

        try {
            // Kullanıcı rolüne göre bilet erişimi kontrolü
            let ticket;
            if (role === 'admin') {
                // Eğer kullanıcı adminse tüm ticketı al
                [ticket] = await connection.query('SELECT * FROM tickets WHERE id = ?', [id]);
            } else {
                // Kullanıcıya ait ticket'ı al
                [ticket] = await connection.query('SELECT * FROM tickets WHERE id = ? AND userId = ?', [id, userId]);
            }

            // Messages sorgusunu güncelle
            const [messages] = await connection.query(`
                SELECT m.*, u.name, u.surname, u.role
                FROM messages m
                         JOIN users u ON m.userId = u.id
                WHERE m.ticketId = ?`, [id]);

            // Log dökümü
            console.log('Retrieved Ticket:', ticket); // Logla
            console.log('Retrieved Messages:', messages); // Logla

            // Eğer bilet bulunamazsa 404 döndür
            if (!ticket || ticket.length === 0) {
                console.log(`Ticket not found or access denied for userId: ${userId}, ticketId: ${id}`);
                return res.status(404).json({ message: 'Ticket not found or access denied' });
            }

            // Ticket ve mesajları döndür
            res.status(200).json({ ticket: ticket[0], messages });
        } catch (error) {
            console.error('Database error:', error.message);
            res.status(500).json({ message: error.message });
        } finally {
            await connection.end(); // Bağlantıyı kapat
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
