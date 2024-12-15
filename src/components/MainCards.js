import { faHouse, faQrcode, faDoorOpen, faPoll, faUserCheck, faUtensils, faCalendarAlt, faUsers, faCalendar, faCheckSquare, faFileAlt, faEnvelope, faFlag, faIdCard, faLaptop, faInfoCircle, faBook, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function MainCards() {
    const items = [
        { title: 'Turnike Geçiş', icon: faHouse, link: '/turnike' },
        { title: 'Etkinlik QR Okutma', icon: faQrcode, link: '/qr-okutma' },
        { title: 'Anketlerim', icon: faPoll, link: '/anketlerim' },
        { title: 'Yemek Listesi', icon: faUtensils, link: '/yemek-listesi' },
        { title: 'Etkinlikler', icon: faCalendarAlt, link: '/etkinlikler' },
        { title: 'Öğrenci Kulüpleri', icon: faUsers, link: '/ogrenci-kulupleri' },
        { title: 'Akademik Takvim', icon: faCalendar, link: '/akademik-takvim' },
        { title: 'Sınav Sonuçları', icon: faFileAlt, link: '/sinav-sonuclari' },
        { title: 'aaim Mail', icon: faEnvelope, link: '/aaim-mail' },
        { title: 'İkazlarım', icon: faFlag, link: '/ticket' },
        { title: 'aalID Kart', icon: faIdCard, link: '/aa-id' },
        { title: 'Office 365', icon: faMicrosoft, link: '/office365' },
        { title: 'aa Uzem Girişi', icon: faLaptop, link: '/aa-uzem' },
        { title: 'Öğrenci Bilgi Sistemi', icon: faInfoCircle, link: '/ogrenci-bilgi' },
        { title: 'Kütüphane', icon: faBook, link: '/kutuphane' },
        { title: 'Çözüm Merkezi', icon: faQuestionCircle, link: '/cozum-merkezi' },
    ];

    return (
        <div className="mt-4">
            <div className="row">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-6 mb-lg-4 mb-md-3 mb-2"
                    >
                        <Link href={item.link}>
                            <div className="card card-border-shadow-warning">
                                <div className="card-body text-center">
                                    <div className="badge rounded p-3 bg-label-warning mb-3">
                                        <FontAwesomeIcon icon={item.icon} size="xl" />
                                    </div>
                                    <h6 className="card-title mb-0">{item.title}</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
