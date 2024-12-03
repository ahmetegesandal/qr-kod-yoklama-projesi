// api/generate-qr.js

import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { createQRCodeData } from '@/components/QRCodeGenerator'; // Fonksiyonu içe aktar
const sanitizeFileName = (name) => {
    // Geçerli karakterleri koruyarak, geçersiz karakterleri kaldırır
    return name.replace(/[^a-zA-Z0-9_\-]/g, '');
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { qrKodId, fileName } = req.body;

        // Gerekli alanların doğrulanması
        if (!qrKodId || !fileName) {
            return res.status(400).json({ error: 'QR Kod ID ve Dosya Adı gereklidir.' });
        }

        const sanitizedFileName = sanitizeFileName(fileName); // Dosya adını temizle

        if (sanitizedFileName !== fileName) {
            return res.status(400).json({ error: 'Dosya adı geçersiz karakterler içeriyor. Lütfen yalnızca alfanümerik karakterler, alt çizgi (_) ve tire (-) kullanın.' });
        }

        // İmza ekleyerek QR kod verisini oluştur
        const qrCodeData = createQRCodeData(qrKodId);
        const uploadDir = path.join(process.cwd(), 'public/images/uploads');

        // Upload dizinini kontrol et
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const qrCodeImagePath = path.join(uploadDir, `${sanitizedFileName}.png`);

        try {
            await QRCode.toFile(qrCodeImagePath, qrCodeData);
            res.status(200).json({ message: 'QR kodu başarıyla oluşturuldu ve kaydedildi.', filePath: `/images/uploads/${sanitizedFileName}.png` });
        } catch (error) {
            console.error('QR kodu oluşturulurken hata:', error);
            res.status(500).json({ error: 'QR kodu oluşturulurken bir hata oluştu.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
