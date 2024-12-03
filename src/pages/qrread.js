import { useState, useEffect, useContext } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from "@/components/Header";
import { UserContext } from "../contexts/UserContext";

function QrCodeScanner() {
    const userData = useContext(UserContext);
    const [data, setData] = useState('No result');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dersId, setDersId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // QR kod işlenirken engelle

    const checkOpenedRollcall = async () => {
        if (!userData || !userData.id) {
            showAlert('error', 'Hata', 'Kullanıcı bilgileri alınamadı.');
            return;
        }

        try {
            const response = await axios.get(`/api/checkActiveClass?userId=${userData.id}`);
            if (response.data.hasClass) {
                setDersId(response.data.classDetails.ders_id);
            } else {
                showAlert('error', 'Hata', response.data.message, false);
            }
        } catch (error) {
            console.error('Açık yoklama kontrolü hatası:', error.response ? error.response.data : error.message);
            showAlert('error', 'Hata', 'Açık yoklama kontrolü yapılamadı.', false);
        }
    };

    useEffect(() => {
        if (userData && userData.id) {
            checkOpenedRollcall();
        }
    }, [userData]);

    const handleScan = async (result) => {
        if (result && !isProcessing) {
            setIsProcessing(true);
            const qrKodId = result.text;

            console.log("QR Koddan Alınan Veri:", qrKodId);

            if (qrKodId && dersId) {
                const isOpened = await checkIfRollcallStarted(dersId);
                if (isOpened) {
                    setData(qrKodId);
                    await recordAttendance(qrKodId);
                    setIsScannerOpen(false);
                } else {
                    showAlert('error', 'Hata', 'Bu ders için yoklama başlatılmamış.');
                }
            } else {
                showAlert('error', 'Hata', 'Geçerli bir QR kod veya ders bulunamadı.');
            }

            setTimeout(() => setIsProcessing(false), 2000);
        }
    };

    const handleError = (err) => {
        console.error('QR Kod Hatası:', err);
        showAlert('error', 'Hata', 'QR kod okunurken hata oluştu.');
    };

    const toggleScanner = () => {
        setIsScannerOpen((prev) => !prev);
    };

    const recordAttendance = async (qrKodId) => {
        try {
            console.log("Yoklama Kaydı Yapılıyor. QR Kod ID:", qrKodId);
            const response = await axios.post('/api/attendance', {
                qr_kod_icerik: qrKodId,
                users_id: userData.id,
                ders_id: dersId
            });
            console.log('Yoklama Kaydı Başarılı:', response.data);
            showAlert('success', 'Başarılı', 'Yoklama kaydı başarıyla yapıldı.');
        } catch (error) {
            console.error('Yoklama kaydı hatası:', error.response ? error.response.data : error.message);
            showAlert('error', 'Hata', 'Yoklama kaydı sırasında bir hata oluştu.');
        }
    };

    const checkIfRollcallStarted = async (dersId) => {
        try {
            const response = await axios.get(`/api/checkRollcall?dersId=${dersId}`);
            return response.data.isRollcallStarted;
        } catch (error) {
            console.error('Yoklama kontrolü sırasında hata:', error.response ? error.response.data : error.message);
            return false;
        }
    };

    const showAlert = (icon, title, text, reloadAfterAlert = true) => {
        Swal.fire({
            icon,
            title,
            text,
            timer: 2000, // 2 saniye boyunca göster
            showConfirmButton: false,
        }).then(() => {
            if (reloadAfterAlert) {
                // Sadece reloadAfterAlert true ise sayfayı yenile
                window.location.reload();
            }
        });
    };

    return (
        <div>
            <Header />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center mb-4">
                            <button
                                className={`btn ${isScannerOpen ? 'btn-danger' : 'btn-primary'}`}
                                onClick={toggleScanner}
                                disabled={!dersId}
                            >
                                {isScannerOpen ? 'Kamerayı Kapat' : 'QR Kodu Oku'}
                            </button>
                        </div>
                        {isScannerOpen && (
                            <div className="text-center mb-4">
                                <QrScanner
                                    onError={handleError}
                                    onScan={handleScan}
                                    style={{ width: '40%', margin: '0 auto' }}
                                />
                            </div>
                        )}
                        <div className="text-center">
                            {dersId && <p className="h5">Geçerli Ders ID: {dersId}</p>}
                            <p className="h5">{data}</p>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QrCodeScanner;
