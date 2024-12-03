import { getConnection } from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { ticketId, message } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.error('Authorization token is missing');
            return res.status(401).json({ message: 'Authorization token required' });
        }

        let connection;
        try {
            // Kullanıcıyı JWT'den doğrula
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            console.log('Decoded JWT:', decoded); // JWT içeriğini logla

            // Veritabanı bağlantısını al
            connection = await getConnection();

            // Kullanıcı bilgilerini al
            const [user] = await connection.query(
                'SELECT id, name, surname, role FROM users WHERE id = ?',
                [userId]
            );

            if (!user || user.length === 0) {
                console.error(`User not found for ID: ${userId}`);
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('User Information:', user[0]); // Kullanıcı bilgilerini logla

            // Yeni mesajı ekle
            const result = await connection.query(
                'INSERT INTO messages (ticketid, userId, content, created_at) VALUES (?, ?, ?, NOW())',
                [ticketId, userId, message]
            );

            if (result.affectedRows === 0) {
                console.error(`Failed to insert message for ticket ID: ${ticketId}`);
                throw new Error('Failed to insert message');
            }

            console.log(`Message inserted for Ticket ID: ${ticketId}, Message ID: ${result.insertId}`); // Mesaj ID logla

            // Ticket durumunu role'e göre güncelle
            const newStatus = user[0].role === 'admin' ? 'Cevaplandı' : 'Yanıt Bekliyor';
            console.log(`Updating Ticket ID: ${ticketId} to Status: ${newStatus}`); // Güncellenecek durumu logla

            const [updateResult] = await connection.query(
                'UPDATE tickets SET status = ? WHERE id = ?',
                [newStatus, ticketId]
            );

            if (updateResult.affectedRows === 0) {
                console.error(`Failed to update ticket status for Ticket ID: ${ticketId}`);
                throw new Error('Ticket status update failed');
            }

            console.log(`Ticket ID: ${ticketId} successfully updated to Status: ${newStatus}`); // Güncelleme başarı logu

            // Mesaj ve güncel durumu döndür
            const insertedMessage = {
                id: result.insertId,
                ticketId,
                userId,
                content: message,
                name: user[0].name,
                surname: user[0].surname,
                role: user[0].role,
                created_at: new Date().toISOString(),
            };

            res.status(200).json({ message: insertedMessage, ticketStatus: newStatus });
        } catch (error) {
            console.error('Error in POST /api/messages:', error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            if (connection) {
                connection.end();
            }
        }
    }
}
