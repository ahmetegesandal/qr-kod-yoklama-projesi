import { getConnection } from '@/lib/db';

export default async function handler(req, res) {
    const { studentId } = req.query;

    if (!studentId) {
        return res.status(400).json({ message: "Öğrenci ID'si gerekli" });
    }

    let connection;
    try {
        connection = await getConnection();

        const query = `
            SELECT DISTINCT
                oe.ogretim_elemani_id,
                oe.unvan AS unvan,
                oe.telefon AS telefon,
                oe.email AS email,
                u.studentnumber AS student_number,
                u.photo as photo
            FROM
                student_courses sc
                    JOIN dersler d ON sc.ders_id = d.ders_id
                    JOIN ogretim_elemanlari oe ON d.ogretim_elemani_id = oe.ogretim_elemani_id
                    JOIN users u ON oe.user_id = u.id
            WHERE
                sc.id = ?
        `;
        const [rows] = await connection.execute(query, [studentId]);

        return res.status(200).json({ instructors: rows });
    } catch (error) {
        console.error("Veritabanı hatası:", error);
        return res.status(500).json({ message: "Bir hata oluştu", error: error.message });
    } finally {
        if (connection) {
            try {
                await connection.end(); // Bağlantının güvenli bir şekilde kapanmasını sağlar
            } catch (closeError) {
                console.error("Bağlantı kapatma hatası:", closeError);
            }
        }
    }
}
