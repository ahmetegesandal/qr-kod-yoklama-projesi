import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    const connection = await getConnection();

    if (req.method === 'GET') {
        try {
            const [categories] = await connection.query('SELECT * FROM categories');
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching categories', error: error.message });
        } finally {
            await connection.end();
        }
    } else if (req.method === 'POST') {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        try {
            const result = await connection.query('INSERT INTO categories (name) VALUES (?)', [name]);
            res.status(201).json({ id: result[0].insertId, name });
        } catch (error) {
            res.status(500).json({ message: 'Error adding category', error: error.message });
        } finally {
            await connection.end();
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
