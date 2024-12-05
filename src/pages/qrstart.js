import { useContext, useState, useEffect } from 'react';
import Header from "../components/Header";
import withAuth from './hoc/withAuth';
import { UserContext } from "@/contexts/UserContext";
import QrScanner from 'react-qr-scanner';
import Swal from "sweetalert2";

function QrStart() {
    const userData = useContext(UserContext);

    if (!userData) {
        return <p>Veriler yükleniyor...</p>;
    }

    if (userData.role !== 'admin') {
        return <p>Bu alana erişim yetkiniz yok.</p>;
    }

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dersler, setDersler] = useState([]);
    const [selectedDersId, setSelectedDersId] = useState('');
    const [selectedDersDetails, setSelectedDersDetails] = useState(null);
    const [selectedOturumlar, setSelectedOturumlar] = useState([]);
    const [qrVisible, setQrVisible] = useState(false);

    useEffect(() => {
        if (userData) {
            fetch(`/api/getTeacherCourses?userId=${userData.id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setDersler(data);
                    } else {
                        setDersler([]);
                    }
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

    const handleOturumSelection = (oturumIndex) => {
        setSelectedOturumlar((prev) => {
            if (prev.includes(oturumIndex)) {
                return prev.filter((index) => index !== oturumIndex); // Oturumu kaldır
            } else {
                return [...prev, oturumIndex]; // Oturumu ekle
            }
        });
    };

    const handleQrResult = (result) => {
        if (result) {
            const scannedDerslikAdi = result.text.trim();
            console.log("Tarama sonucu (Derslik Adı):", scannedDerslikAdi);

            if (selectedDersDetails) {
                if (scannedDerslikAdi === selectedDersDetails.derslik_adi) {
                    console.log("Derslik eşleşti, yoklama başlatılıyor...");
                    const oturumlar = selectedOturumlar.length > 0
                        ? selectedOturumlar.map((index) => selectedDersDetails.oturumlar[index])
                        : selectedDersDetails.oturumlar;

                    addRollcall(selectedDersDetails.qr_kod_id, oturumlar);
                    setQrVisible(false);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: 'QR kod yanlış veya eşleşmedi.',
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }
            } else {
                setMessage('Ders seçimi yapılmadı.');
            }
        }
    };

    const addRollcall = async (qrKodId, oturumlar) => {
        setLoading(true);
        setMessage('');

        try {
            for (const oturum of oturumlar) {
                const response = await fetch('/api/openedRollcall', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ders_id: selectedDersId,
                        users_id: userData.id,
                        tarih: new Date().toISOString().split('T')[0],
                        durum: 'acik',
                        baslangic_saati: oturum.başlangıç_saati,
                        bitis_saati: oturum.bitiş_saati,
                        qr_kod_id: qrKodId,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Hata: ${errorData.error || 'Bilinmeyen hata'}`);
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: errorData.error || 'Bir hata oluştu',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    return;
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Başarılı',
                text: 'Seçilen oturumlar başarıyla başlatıldı!',
                timer: 1500,
                showConfirmButton: false,
            }).then(() => window.location.reload());
        } catch (error) {
            console.error('İstek hatası:', error);
            setMessage('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="container mt-4">
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
                        <div className="card-header bg-primary text-white">Seçilen Ders Bilgileri</div>
                        <div className="card-body mt-5">
                            <p><strong>Ders Kodu:</strong> {selectedDersDetails.ders_kodu}</p>
                            <p><strong>Ders Adı:</strong> {selectedDersDetails.ders_adı}</p>
                            <p><strong>Derslik:</strong> {selectedDersDetails.derslik_adi || 'Belirtilmemiş'}</p>
                            <p><strong>Öğretim Elemanı:</strong> {selectedDersDetails.ogretim_elemanı}</p>
                            <div>
                                <strong>Oturumlar:</strong>
                                <ul className="list-group">
                                    {selectedDersDetails.oturumlar.map((oturum, index) => (
                                        <li key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center">
                                            <label className="form-check-label d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    checked={selectedOturumlar.includes(index)}
                                                    onChange={() => handleOturumSelection(index)}
                                                />
                                                {`${oturum.başlangıç_saati} - ${oturum.bitiş_saati}`}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                                <div className="alert alert-info mt-3">
                                    <small>Eğer hiçbir oturum seçmezseniz, tüm oturumlar aynı anda açılacaktır.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setQrVisible((prev) => !prev)}
                    disabled={loading || !selectedDersId}
                    className={`btn ${qrVisible ? 'btn-danger' : 'btn-primary'} mb-3`}
                >
                    {qrVisible ? 'QR Kod Okuyucuyu Kapat' : 'QR Kod ile Yoklama Başlat'}
                </button>

                {qrVisible && (
                    <div className="qr-scanner-wrapper" style={{width: '100%', maxWidth: '500px', margin: '0 auto'}}>
                        <QrScanner
                            delay={300}
                            onError={(error) => console.error(error)}
                            onScan={(result) => result && handleQrResult(result)}
                        />
                    </div>
                )}

                {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
        </>
    );
}

export default withAuth(QrStart);
