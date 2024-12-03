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
        { title: 'Arelim Mail', icon: faEnvelope, link: '/arelim-mail' },
        { title: 'İkazlarım', icon: faFlag, link: '/ikazlarim' },
        { title: 'ArellID Kart', icon: faIdCard, link: '/arel-id' },
        { title: 'Office 365', icon: faMicrosoft, link: '/office365' },
        { title: 'AREL Uzem Girişi', icon: faLaptop, link: '/arel-uzem' },
        { title: 'Öğrenci Bilgi Sistemi', icon: faInfoCircle, link: '/ogrenci-bilgi' },
        { title: 'Kütüphane', icon: faBook, link: '/kutuphane' },
        { title: 'Çözüm Merkezi', icon: faQuestionCircle, link: '/cozum-merkezi' },
    ];


    return (
        <div className="mt-4">
            <div className="row">
                {items.map((item, index) => (
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <Link href={item.link}>
                            <div className="card card-border-shadow-warning h-100">
                                <div className="card-body">

                                    <div className="badge rounded p-2 bg-label-warning mb-2">
                                        <FontAwesomeIcon icon={item.icon} size="xl" />

                                    </div>
                                    <h5 className="card-title mb-1">{item.title}</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
}
