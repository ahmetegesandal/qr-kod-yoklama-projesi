import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import DOMPurify from "dompurify";

import { UserContext } from "@/contexts/UserContext";

function Header() {
    const userData = useContext(UserContext);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

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
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li>
                <Link className="dropdown-item" href="/profil">Profil Ayarları</Link>
            </li>
            <li>
                <Link className="dropdown-item" href="/notifications">Bildirimler</Link>
            </li>
            <li>
                <Link className="dropdown-item" href="/tercihler">Tercihler</Link>
            </li>
            <li>
                <a className="dropdown-item" onClick={handleLogout} style={{cursor: 'pointer'}}>
                    Çıkış Yap
                </a>
            </li>
        </ul>
    );

    useEffect(() => {
        if (userData?.id) {
            const fetchNotifications = async () => {
                try {
                    const response = await fetch(`/api/notifications?userId=${userData.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch notifications');
                    }
                    const data = await response.json();
                    console.log('Fetched Notifications:', data); // Bildirimleri kontrol edin
                    setNotifications(data);
                } catch (error) {
                    console.error('Error fetching notifications:', error.message);
                }
            };

            fetchNotifications();
        }
    }, [userData?.id]);

    const markAsRead = async (id) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                // State'teki bildirimi okundu olarak işaretle
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === id ? { ...notification, is_read: true } : notification
                    )
                );
            } else {
                console.error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error.message);
        }
    };
    const truncateText = (html, maxLength) => {
        // HTML içeriğini temizle ve düz metne çevir
        const cleanText = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        // Düz metni kısalt
        if (cleanText.length > maxLength) {
            return cleanText.slice(0, maxLength) + "...";
        }
        return cleanText;
    };

    const renderNotificationsMenu = () => {
        return (
            <div
                className="dropdown-menu dropdown-menu-end p-3"
                aria-labelledby="notificationDropdown"
                style={{ width: "350px", maxHeight: "400px", overflowY: "auto" }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="m-0">Bildirimler</h6>
                </div>

                <div className="list-group">
                    {notifications.slice(0, 3).map((notification) => (
                        <div
                            key={notification.id}
                            className={`list-group-item border-0 d-flex align-items-center mb-2 ${
                                notification.is_read ? 'bg-light' : 'bg-white'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div
                                className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-3"
                                style={{ width: "40px", height: "40px" }}
                            >
                                S
                            </div>
                            <div>
                                <strong>{notification.title}</strong>
                                {notification.link && (
                                    <p className="mb-0 text-muted small">
                                        {truncateText(notification.message, 35)}
                                    </p>
                                )}
                                <span className="text-muted small">
                                {new Date(notification.created_at).toLocaleString()}
                            </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-3">
                    <Link href="/notifications" passHref>
                        <button className="btn btn-primary btn-sm">Tüm Bildirimleri Gör</button>
                    </Link>
                </div>
            </div>
        );
    };


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
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="2xl"/>
                </button>
                <Link href="/main" className="navbar-brand d-flex align-items-center">
                    <img src="/images/logo.png" alt="Logo" style={{height: '40px'}} className="me-2"/>
                    <h2 style={{color: 'var(--bs-primary)', margin: '0', fontWeight: '700'}}>
                        AREL<span style={{color: '#ab8e58'}}>im</span>
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
                    <ul className="navbar-nav flex-wrap me-auto mb-2 mb-lg-0">
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
                        <div className="dropdown d-flex">
                            { /*  bildirim butonu kısmı */}
                            <button
                                className="btn d-flex align-items-center dropdown-toggle position-relative"
                                type="button"
                                id="notificationsMenu"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div className="position-relative">
                                    <FontAwesomeIcon icon={faEnvelope} size="xl"/>
                                    {notifications.filter(n => !n.is_read).length > 0 && (
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                            style={{
                                                fontSize: '0.7rem',
                                                padding: '4px',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        >
                    {notifications.filter(n => !n.is_read).length}
                </span>
                                    )}
                                </div>
                            </button>
                            {renderNotificationsMenu()}
                            { /* profil kısmı */}
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
                                    style={{height: '30px', width: '30px'}}
                                />
                                <div style={{lineHeight: '1rem'}}>
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
