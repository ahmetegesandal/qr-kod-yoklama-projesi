// qrsatart.js

import { useContext, useState, useEffect } from 'react';
import Header from "../components/Header";
import withAuth from './hoc/withAuth';
import { UserContext } from "@/contexts/UserContext";
import QrScanner from 'react-qr-scanner';
import Swal from "sweetalert2";

function QrStart() {
    const userData = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dersler, setDersler] = useState([]);
    const [selectedDersId, setSelectedDersId] = useState('');
    const [selectedDersDetails, setSelectedDersDetails] = useState(null);
    const [durum, setDurum] = useState('acik');
    const [qrVisible, setQrVisible] = useState(false); // QR kod okuma görünürlüğü
    const [baslangicSaati, setBaslangicSaati] = useState(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    const [bitisSaati, setBitisSaati] = useState('');

    useEffect(() => {
        if (userData) {
            fetch(`/api/getTeacherCourses?userId=${userData.id}`)
                .then((response) => response.json())
                .then((data) => {
                    setDersler(Array.isArray(data) ? data : []);
                })
                .catch((error) => {
                    console.error('Dersler alınamadı:', error);
                });
        }
    }, [userData]);

    useEffect(() => {
        if (selectedDersId) {
            const ders = dersler.find((d) => d.ders_id === parseInt(selectedDersId));
            setSelectedDersDetails(ders || null);
        } else {
            setSelectedDersDetails(null);
        }
    }, [selectedDersId, dersler]);

    const handleQrResult = (result) => {
        if (result) {
            const scannedDerslikAdi = result.text.trim(); // QR koddan gelen veriyi derslik adı olarak kabul ediyoruz
            console.log("Tarama sonucu (Derslik Adı):", scannedDerslikAdi);

            if (selectedDersDetails) {
                // Gelen QR kod derslik adı ile seçilen dersin derslik adı eşleşiyor mu?
                if (scannedDerslikAdi === selectedDersDetails.derslik_adi) {
                    console.log("Derslik eşleşti, yoklama başlatılıyor...");
                    addRollcall(selectedDersDetails.qr_kod_id); // QR Kod ID'yi gönderiyoruz
                    setQrVisible(false); // QR kod okuyucuyu kapat
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: 'QR kod yanlış veya eşleşmedi.',
                        timer: 3000, // 1.5 saniye boyunca göster
                        showConfirmButton: false, // "Tamam" butonunu gizle
                    }).then(() => {
                        // SweetAlert kapandıktan sonra istenirse sayfa yönlendirme yapılabilir
                        window.location.reload(); // Sayfayı yeniler
                    });
                }
            } else {
                setMessage('Ders seçimi yapılmadı.');
            }
        }
    };


    const addRollcall = async (qrKodId) => {
        setLoading(true);
        setMessage('');

        try {
            console.log('API çağrısı için gönderilen veri:', {
                ders_id: selectedDersId,
                users_id: userData ? userData.id : null,
                tarih: new Date().toISOString().split('T')[0],
                durum,
                baslangic_saati: baslangicSaati,
                bitis_saati: bitisSaati,
                qr_kod_id: qrKodId,
            });

            const response = await fetch('/api/openedRollcall', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ders_id: selectedDersId,
                    users_id: userData ? userData.id : null,
                    tarih: new Date().toISOString().split('T')[0],
                    durum,
                    baslangic_saati: baslangicSaati,
                    bitis_saati: bitisSaati,
                    qr_kod_id: qrKodId, // QR Kod ID doğrudan gönderiliyor
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Yoklama başarıyla eklendi');
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Yoklama başarıyla eklendi!',
                    timer: 1500, // 1.5 saniye boyunca göster
                    showConfirmButton: false, // "Tamam" butonunu gizle
                }).then(() => {
                    // SweetAlert kapandıktan sonra istenirse sayfa yönlendirme yapılabilir
                    window.location.reload(); // Sayfayı yeniler
                });
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Bir hata oluştu');
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: errorData.error || 'Bir hata oluştu',
                    timer: 1500, // 1.5 saniye boyunca göster
                    showConfirmButton: false, // "Tamam" butonunu gizle
                }).then(() => {
                    // SweetAlert kapandıktan sonra istenirse sayfa yönlendirme yapılabilir
                    window.location.reload(); // Sayfayı yeniler
                });
            }
        } catch (error) {
            console.error('İstek hatası:', error);
            setMessage('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    };



    const qrScannerStyle = {
        width: '100%',
        height: '100%',
    };

    return (
        <>
            <Header />

            <div className="container mt-4">
                {userData ? (
                    <>
                        <div className="mb-4">
                            <h3>Hoş Geldiniz, {userData.role}</h3>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="dersSecimi" className="form-label">Ders Seçimi:</label>
                            <select
                                id="dersSecimi"
                                className="form-select"
                                value={selectedDersId}
                                onChange={(e) => setSelectedDersId(e.target.value)}
                            >
                                <option value="">Ders Seçin</option>
                                {dersler.map((ders) => (
                                    <option key={ders.ders_id} value={ders.ders_id}>
                                        {ders.ders_adı}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedDersDetails && (
                            <div className="card mb-4">
                                <div className="card-header bg-primary text-white">
                                    Seçilen Ders Bilgileri
                                </div>
                                <div className="card-body p-5">
                                    <p><strong>Ders Kodu:</strong> {selectedDersDetails.ders_kodu}</p>
                                    <p><strong>Ders Adı:</strong> {selectedDersDetails.ders_adı}</p>
                                    <p><strong>Derslik:</strong> {selectedDersDetails.derslik_adi || 'Belirtilmemiş'}</p>
                                    <p><strong>Öğretim Elemanı:</strong> {selectedDersDetails.ogretim_elemanı}</p>
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="baslangicSaati" className="form-label">Başlangıç Saati:</label>
                            <input
                                type="time"
                                id="baslangicSaati"
                                className="form-control"
                                value={baslangicSaati}
                                onChange={(e) => setBaslangicSaati(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bitisSaati" className="form-label">Bitiş Saati:</label>
                            <input
                                type="time"
                                id="bitisSaati"
                                className="form-control"
                                value={bitisSaati}
                                onChange={(e) => setBitisSaati(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="durum" className="form-label">Durum:</label>
                            <select
                                id="durum"
                                className="form-select"
                                value={durum}
                                onChange={(e) => setDurum(e.target.value)}
                            >
                                <option value="acik">Açık</option>
                                <option value="kapali">Kapalı</option>
                            </select>
                        </div>

                        {/* QR Kodu Okuyucu Açma Butonu */}
                        <button
                            onClick={() => setQrVisible(true)}
                            disabled={loading || !selectedDersId || !bitisSaati}
                            className="btn btn-primary mb-3"
                        >
                            QR Kod ile Yoklama Başlat
                        </button>

                        {qrVisible && (
                            <div className="qr-scanner-wrapper" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                                <QrScanner
                                    delay={300}
                                    style={qrScannerStyle}
                                    onError={(error) => console.error(error)}
                                    onScan={(result) => {
                                        if (result) handleQrResult(result);
                                    }}
                                />
                            </div>
                        )}

                        {message && <div className="mt-3 alert alert-info">{message}</div>}
                    </>
                ) : (
                    <div className="alert alert-warning">Yükleniyor...</div>
                )}
            </div>
        </>
    );
}

export default withAuth(QrStart);
