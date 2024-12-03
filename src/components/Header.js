import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

import { UserContext } from "@/contexts/UserContext";

function Header() {
    const userData = useContext(UserContext);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Çıkış Yapmak Üzeresiniz',
            text: "Oturumunuzu kapatmak istediğinizden emin misiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, Çıkış Yap!',
            cancelButtonText: 'İptal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                router.push('/sign-in');
            }
        });
    };

    const renderDropdownMenu = () => (
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start" aria-labelledby="dropdownMenuButton">
            <li>
                <Link className="dropdown-item" href="/profil">Profil Ayarları</Link>
            </li>
            <li>
                <a className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    Çıkış Yap
                </a>
            </li>
            <li>
                <Link className="dropdown-item" href="/destek">Destek</Link>
            </li>
        </ul>
    );

    return (
        <nav className="navbar navbar-expand-lg landing-navbar bg-primary shadow-sm">
            <div className="container">
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                    aria-controls="navbarNav"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                >
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="2xl" />
                </button>
                <Link href="/main" className="navbar-brand d-flex align-items-center">
                    <img src="/images/logo.png" alt="Logo" style={{ height: '40px' }} className="me-2" />
                    <h2 style={{ color: 'var(--bs-primary)', margin: '0', fontWeight: '700' }}>
                        AREL<span style={{ color: '#ab8e58' }}>im</span>
                    </h2>
                </Link>

                <div className="d-flex align-items-center d-block d-lg-none">
                    <div className="dropdown">
                        <button
                            className="btn d-flex align-items-center dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            data-bs-display="static"
                        >
                            <img
                                src={userData && userData.photo ? `/images/uploads/profile_pictures/${userData.photo}` : '/images/default-profile.png'}
                                alt="Profile"
                                className="rounded"
                                style={{ height: '30px', width: '30px' }}
                            />
                        </button>
                        {renderDropdownMenu()}
                    </div>
                </div>

                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {[
                            { href: '/main', label: 'Ana Sayfa', color: '#F4A261' },

                            ...(userData && userData.role === 'admin' ? [
                                { href: '/admin-dashboard', label: 'Admin Paneli', color: '#E76F51', dropdown: [
                                        { href: '/register', label: 'Yeni Öğrenci Ekle' },
                                        { href: '/qrcreate', label: 'QR Oluştur' },
                                    ] }
                            ] : []),

                            {
                                href: userData && userData.role === 'admin' ? '/ticketadmin' : '/ticket',
                                label: 'İkazlar ve Başvurular',
                                color: 'var(--green)'
                            },

                            { href: '/ogrenci-isleri', label: 'Öğrenci İşleri', color: '#2A9D8F', dropdown: [
                                    { href: '/courseschedule', label: 'Ders Programı' },

                                    ...(userData && userData.role === 'student' ? [
                                        { href: '/qrread', label: 'QR Okut' },
                                        { href: '/rollcall', label: 'Yoklama Durumu' }
                                    ] : []),
                                    ...(userData && userData.role === 'admin' ? [
                                        { href: '/qrstart', label: 'QR Başlat' }
                                    ] : []),
                                ]},
                            { href: '/arel-yasam', label: 'Arel Yaşam', color: '#E9C46A', dropdown: [
                                    { href: '/arel-yasam/etkinlikler', label: 'Etkinlikler' },
                                    { href: '/arel-yasam/duyurular', label: 'Duyurular' },
                                    { href: '/arel-yasam/katilimci', label: 'Katılımcı Ol' },
                                ]},
                            { href: '/basvurular', label: 'Başvurular', color: '#f76707', dropdown: [
                                    { href: '/basvurular/staj', label: 'Staj Başvurusu' },
                                    { href: '/basvurular/yeni', label: 'Yeni Başvuru' },
                                    { href: '/basvurular/durum', label: 'Başvuru Durumu' },
                                ]},
                            { href: '/ogrenci-bilgi', label: 'Öğrenci Bilgi', color: '#4C6EF5', dropdown: [
                                    { href: '/ogrenci-bilgi/profil', label: 'Profil Bilgileri' },
                                    { href: '/ogrenci-bilgi/transkript', label: 'Transkript' },
                                    { href: '/ogrenci-bilgi/mesajlar', label: 'Mesajlar' },
                                ]},
                        ].map(({ href, label, color, dropdown }, index) => (
                            <li key={index} className={`nav-item ${dropdown ? 'dropdown' : ''}`}>
                                <Link href={href} className={`nav-link ${dropdown ? 'dropdown-toggle' : ''}`} id={`${label}Dropdown`} role={dropdown ? 'button' : undefined} data-bs-toggle={dropdown ? 'dropdown' : undefined} aria-expanded="false">
                                    {label}
                                </Link>
                                {dropdown && (
                                    <ul className="dropdown-menu" aria-labelledby={`${label}Dropdown`}>
                                        {dropdown.map((item, idx) => (
                                            <li key={idx}><Link className="dropdown-item" href={item.href}>{item.label}</Link></li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center d-none d-lg-block">
                        <div className="dropdown">
                            <button
                                className="btn d-flex align-items-center dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    src={userData && userData.photo ? `/images/uploads/profile_pictures/${userData.photo}` : '/images/default-profile.png'}
                                    alt="Profile"
                                    className="rounded me-2"
                                    style={{ height: '30px', width: '30px' }}
                                />
                                <div style={{ lineHeight: '1rem' }}>
                                    <p className="mb-0">{userData ? `${userData.name} ${userData.surname}` : 'Kullanıcı Adı'}</p>
                                    <small>{userData ? `${userData.bolum_adi}` : 'Yükleniyor...'}</small>
                                </div>
                            </button>
                            {renderDropdownMenu()}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
