import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import DOMPurify from "dompurify";

function stripHtml(html) {
    const cleanHtml = DOMPurify.sanitize(html); // HTML'i temizle
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanHtml;
    return tempDiv.textContent || tempDiv.innerText || ""; // Yalnızca metin kısmını al
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export default function Notifications() {
    const userData = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); // all, read, unread
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userData?.id) {
            fetchNotifications();
        }
    }, [userData?.id]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/notifications?userId=${userData.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const data = await response.json();
            setNotifications(data);
            setFilteredNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error.message);
            Swal.fire("Hata", "Bildirimler yüklenemedi.", "error");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                // Bildirim listesini yeniden yükle
                await fetchNotifications();
                Swal.fire("Başarılı", "Bildirim okundu olarak işaretlendi.", "success");
            } else {
                throw new Error("Failed to mark notification as read");
            }
        } catch (error) {
            console.error("Error marking notification as read:", error.message);
            Swal.fire("Hata", "Bildirimi işaretlerken bir hata oluştu.", "error");
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`/api/notifications/markAllAsRead`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userData.id }),
            });

            if (response.ok) {
                // Bildirim listesini yeniden yükle
                await fetchNotifications();
                Swal.fire("Başarılı", "Tüm bildirimler okundu olarak işaretlendi.", "success");
            } else {
                const errorData = await response.json();
                console.error("API Hatası:", errorData);
                throw new Error(errorData.message || "Tüm bildirimler işaretlenemedi.");
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error.message);
            Swal.fire("Hata", "Tüm bildirimleri işaretlerken bir hata oluştu.", "error");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        applyFilterAndSearch(filter, e.target.value);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        applyFilterAndSearch(newFilter, searchTerm);
    };

    const applyFilterAndSearch = (filter, search) => {
        let filtered = [...notifications];

        // Filtreleme
        if (filter === "read") {
            filtered = filtered.filter((n) => n.is_read);
        } else if (filter === "unread") {
            filtered = filtered.filter((n) => !n.is_read);
        }

        // Arama
        if (search.trim()) {
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(search.toLowerCase()) ||
                    n.message.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredNotifications(filtered);
        setCurrentPage(1); // Arama veya filtre değiştiğinde sayfa sıfırla
    };

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const currentData = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container mt-4">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h3 className="mb-4">Tüm Bildirimler</h3>

                {/* Arama ve Filtreleme */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Bildirimlerde Ara..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="col-md-6 text-end">
                        <div className="btn-group">
                            <button
                                className={`btn btn-sm btn-outline-primary ${filter === "all" ? "active" : ""}`}
                                onClick={() => handleFilterChange("all")}
                            >
                                Tümü
                            </button>
                            <button
                                className={`btn btn-sm btn-outline-success ${filter === "read" ? "active" : ""}`}
                                onClick={() => handleFilterChange("read")}
                            >
                                Okunan
                            </button>
                            <button
                                className={`btn btn-sm btn-outline-warning ${filter === "unread" ? "active" : ""}`}
                                onClick={() => handleFilterChange("unread")}
                            >
                                Okunmamış
                            </button>
                        </div>
                        <button
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={markAllAsRead}
                        >
                            Tümünü Okundu Yap
                        </button>
                    </div>
                </div>

                {/* Bildirim Listesi */}
                {filteredNotifications.length === 0 ? (
                    <p className="text-muted">Hiç bir bildirim bulunamadı.</p>
                ) : (
                    <div className="list-group">
                        {currentData.map((notification) => (
                            <div
                                key={notification.id}
                                className={`list-group-item d-flex justify-content-between align-items-start ${
                                    notification.is_read ? "bg-light text-muted" : "bg-white"
                                }`}
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{notification.title}</div>
                                    {notification.message && (
                                        <p className="mb-0 text-muted small">
                                            {truncateText(stripHtml(notification.message), 50)}
                                        </p>
                                    )}
                                    {notification.link && (
                                        <a
                                            href={notification.link}
                                            className="text-decoration-none text-primary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Detayları Gör
                                        </a>
                                    )}
                                    <small className="text-muted d-block">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </small>
                                </div>
                                {!notification.is_read && (
                                    <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        Okundu
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Sayfalama */}
                {totalPages > 1 && (
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <li
                                    key={page}
                                    className={`page-item ${currentPage === page ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
}
