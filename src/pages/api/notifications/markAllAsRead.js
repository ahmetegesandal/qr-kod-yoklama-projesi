import { getConnection } from "@/lib/db";

export default async function handler(req, res) {
    if (req.method === "PUT") {
        const { userId } = req.body;

        if (!userId) {
            console.error("User ID eksik");
            return res.status(400).json({ message: "User ID is required." });
        }

        const connection = await getConnection();

        try {
            // Kullanıcının tüm bildirimlerini okundu olarak işaretle
            const [result] = await connection.query(
                `UPDATE notifications SET is_read = 1 WHERE userId = ? OR userId = 0`,
                [userId]
            );

            console.log(`Etki edilen satır sayısı: ${result.affectedRows}`);
            res.status(200).json({ message: "Tüm bildirimler okundu olarak işaretlendi.", affectedRows: result.affectedRows });
        } catch (error) {
            console.error("Error marking all notifications as read:", error.message);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            await connection.end();
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
