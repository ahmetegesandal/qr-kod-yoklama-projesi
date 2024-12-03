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
    const [durum, setDurum] = useState('acik');
    const [qrVisible, setQrVisible] = useState(false);
    const [baslangicSaati, setBaslangicSaati] = useState(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    const [bitisSaati, setBitisSaati] = useState('');


    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

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



    const isDersActive = (ders) => {
        console.log('Ders:', ders); // Veriyi kontrol edin
        if (!ders || !ders.başlangıç_saati || !ders.bitiş_saati) {
            console.warn('Başlangıç veya bitiş saati eksik:', ders);
            return false;
        }

        try {
            const [baslangicSaat, baslangicDakika] = ders.başlangıç_saati.split(':').map(Number);
            const [bitisSaat, bitisDakika] = ders.bitiş_saati.split(':').map(Number);

            const now = currentHours * 60 + currentMinutes;
            const dersBaslangic = baslangicSaat * 60 + baslangicDakika;
            const dersBitis = bitisSaat * 60 + bitisDakika;

            return now >= dersBaslangic && now <= dersBitis;
        } catch (error) {
            console.error('Saat ayrıştırma hatası:', error);
            return false;
        }
    };

    const handleQrResult = (result) => {
        if (result) {
            const scannedDerslikAdi = result.text.trim();
            console.log("Tarama sonucu (Derslik Adı):", scannedDerslikAdi);

            if (selectedDersDetails) {
                if (scannedDerslikAdi === selectedDersDetails.derslik_adi) {
                    console.log("Derslik eşleşti, yoklama başlatılıyor...");
                    addRollcall(selectedDersDetails.qr_kod_id);
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

    const addRollcall = async (qrKodId) => {
        if (!selectedDersDetails) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Lütfen bir ders seçin!',
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Ders saatlerini seçilen ders detaylarından alın
            const formattedBaslangicSaati = `${selectedDersDetails.başlangıç_saati}:00`;
            const formattedBitisSaati = `${selectedDersDetails.bitiş_saati}:00`;

            console.log('Gönderilen Başlangıç Saati:', formattedBaslangicSaati);
            console.log('Gönderilen Bitiş Saati:', formattedBitisSaati);

            const response = await fetch('/api/openedRollcall', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ders_id: selectedDersId,
                    users_id: userData.id,
                    tarih: new Date().toISOString().split('T')[0],
                    durum,
                    baslangic_saati: formattedBaslangicSaati,
                    bitis_saati: formattedBitisSaati,
                    qr_kod_id: qrKodId,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Yoklama başarıyla eklendi!',
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => window.location.reload());
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: errorData.error || 'Bir hata oluştu',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
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
                            <option
                                key={ders.ders_id}
                                value={ders.ders_id}
                                disabled={!isDersActive(ders)}
                            >
                                {ders.ders_adı} {!isDersActive(ders) ? '(Şuan Açılamaz)' : ''}
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
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setQrVisible((prev) => !prev)} // Duruma bağlı olarak aç/kapa işlemi yapar
                    disabled={loading || !selectedDersId || !isDersActive(selectedDersDetails)}
                    className={`btn ${qrVisible ? 'btn-danger' : 'btn-primary'} mb-3`} // Buton rengi duruma göre değişir
                >
                    {qrVisible ? 'QR Kod Okuyucuyu Kapat' : 'QR Kod ile Yoklama Başlat'} {/* Duruma göre metin değişir */}
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
