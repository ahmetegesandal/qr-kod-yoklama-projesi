// pages/qrcreate.js
import React, { useState } from 'react';
import Header from "@/components/Header";
import axios from 'axios';
import withAuth from './hoc/withAuth';

const QRCodeGenerator = () => {
    const [qrKodId, setQrKodId] = useState('');
    const [fileName, setFileName] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');

    const handleGenerateQRCode = async () => {
        try {
            const response = await axios.post('/api/generate-qr', {
                qrKodId,
                fileName
            });

            setQrDataUrl(response.data.filePath); // Başarılı olduğunda dosya yolunu ayarla
        } catch (error) {
            console.error('QR kodu oluşturulurken hata:', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <Header/>
            <div className="container mt-5">
                <h2 className="mb-4">QR Kod Oluştur</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={qrKodId}
                        onChange={(e) => setQrKodId(e.target.value)}
                        placeholder="QR Kod ID"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Dosya Adı"
                    />
                </div>
                <button onClick={handleGenerateQRCode} className="btn btn-primary">QR Kodu Oluştur</button>
                {qrDataUrl && (
                    <div className="mt-4">
                        <img src={qrDataUrl} alt="QR Kod" className="img-fluid"/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withAuth(QRCodeGenerator);
