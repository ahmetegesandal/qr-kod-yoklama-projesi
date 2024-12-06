// api/tickets.js
import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    const { userId, role } = req.query; // role ve userId'yi alıyoruz

    const connection = await getConnection(); // Bağlantıyı oluştur

    if (req.method === 'GET') {
        try {
            let tickets;
            if (role === 'admin') {
                // Eğer kullanıcı adminse tüm ticketları getir
                [tickets] = await connection.query(`
                SELECT tickets.*, categories.name AS categoryName
                FROM tickets
                LEFT JOIN categories ON tickets.categoryId = categories.id
            `);
            } else {
                // Kullanıcıya ait ticketları al
                [tickets] = await connection.query(`
                SELECT tickets.*, categories.name AS categoryName
                FROM tickets
                LEFT JOIN categories ON tickets.categoryId = categories.id
                WHERE tickets.userId = ?
            `, [userId]);
            }
            res.status(200).json(tickets); // Ticketları döndür
        } catch (error) {
            console.error('Database error:', error.message);
            res.status(500).json({ message: error.message });
        } finally {
            await connection.end(); // Bağlantıyı kapat
        }
    } else if (req.method === 'POST') {
        const { subject, description, categoryId  } = req.body; // Ticket verileri

        if (!userId || !subject || !description) {
            return res.status(400).json({ message: 'Geçersiz giriş' });
        }

        try {
            // Yeni ticket ekle
            const result = await connection.query(
                'INSERT INTO tickets (userId, subject, description, categoryId, created_at) VALUES (?, ?, ?, ?, ?)',
                [
                    userId,
                    subject,
                    description,
                    categoryId,
                    new Date(),
                ]
            );

            // Ticketın ID'sini alın
            const newTicketId = result[0].insertId;
            res.status(201).json({ message: 'Ticket başarıyla oluşturuldu', ticketId: newTicketId });
        } catch (error) {
            console.error('Database error:', error.message);
            res.status(500).json({ message: error.message });
        } finally {
            await connection.end(); // Bağlantıyı kapat
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`); // Hata mesajında string interpolasyonu düzeltildi
    }
}
