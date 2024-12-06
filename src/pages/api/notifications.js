import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    const connection = await getConnection();

    if (req.method === 'POST') {
        const { title, message, link } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        try {
            // Tüm kullanıcılar için bildirim ekle
            await connection.query(
                `
                    INSERT INTO notifications (userId, title, message, link, is_read, created_at)
                    SELECT id, ?, ?, ?, false, NOW()
                    FROM users
                `,
                [title, message, link || null]
            );

            res.status(201).json({ message: 'Notification created for all users.' });
        } catch (error) {
            console.error('Error creating notifications:', error.message);
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'GET') {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const [notifications] = await connection.query(
                `
                    SELECT id, title, message, link, is_read, created_at
                    FROM notifications
                    WHERE userId = ? OR userId = 0
                    ORDER BY created_at DESC
                `,
                [userId]
            );

            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'PUT') {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Notification ID is required' });
        }

        try {
            const [result] = await connection.query(
                `
                    UPDATE notifications
                    SET is_read = true
                    WHERE id = ?
                `,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Notification not found' });
            }

            res.status(200).json({ message: 'Notification marked as read.' });
        } catch (error) {
            console.error('Error updating notification:', error.message);
            res.status(500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    await connection.end();
}
