import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import { UserContext } from "@/contexts/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import withAuth from './hoc/withAuth';
import Swal from "sweetalert2";

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function TicketAdmin() {
    const userData = useContext(UserContext);

    if (!userData) {
        return <p>Oturum açmanız gerekiyor...</p>;
    }

    if (userData.role !== 'admin') {
        return <p>Bu alana erişim yetkiniz yok.</p>;
    }

    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const { id: userId, role } = useContext(UserContext) || {};
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`/api/tickets?userId=${userId}&role=${role}`);
                if (!response.ok) {
                    throw new Error("API hatası");
                }
                const data = await response.json();
                setTickets(data);
            } catch (error) {
                console.error("Ticket verisi alınamadı:", error);
            }
        };

        fetchTickets();
    }, [userId, role]);

    useEffect(() => {
        const filtered = tickets.filter(ticket => {
            const matchesSearchTerm =
                ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterStatus === 'all' || (filterStatus === 'pending' && ticket.status === 'Yanıt Bekliyor');
            return matchesSearchTerm && matchesFilter;
        });

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        setFilteredTickets(filtered);
        setCurrentData([...filtered].reverse().slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, tickets, searchTerm, filterStatus]);

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    const deleteTicket = async (ticketId) => {
        // Kullanıcıdan silme işlemi için onay al
        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: 'Bu ticket kalıcı olarak silinecek!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/deltick/${ticketId}?role=${userData.role}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Backend Hatası:", errorData.message);
                    throw new Error(errorData.message || "Ticket silinemedi.");
                }

                // Ticket başarıyla silindiyse listeyi güncelle
                setTickets(tickets.filter(ticket => ticket.id !== ticketId));

                // Başarılı mesajı
                Swal.fire(
                    'Silindi!',
                    'Ticket başarıyla silindi.',
                    'success'
                );
            } catch (error) {
                console.error("Ticket silinirken hata oluştu:", error.message);

                // Hata mesajı
                Swal.fire(
                    'Hata!',
                    error.message || 'Bir hata oluştu.',
                    'error'
                );
            }
        } else {
            // Kullanıcı iptal ederse mesaj gösterilebilir
            console.log('Kullanıcı silme işlemini iptal etti.');
        }
    };

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h4 className="mb-4">Ticket Listesi</h4>

                <div className="d-flex column-gap-3 justify-content-between mb-3">
                    <input
                        type="text"
                        placeholder="Arama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control w-75"
                    />
                    <select
                        className="form-select w-25"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tüm Ticketlar</option>
                        <option value="pending">Sadece Yanıt Bekliyor</option>
                    </select>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>Kategori</th> {/* Yeni kategori sütunu */}
                            <th>Konu</th>
                            <th>Açıklama</th>
                            <th>Durum</th>
                            <th>Oluşturulma Zamanı</th>
                            <th>İşlemler</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentData.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.categoryName || 'Belirtilmemiş'}</td>
                                <td>{truncateText((ticket.subject), 15)}</td>
                                <td>{truncateText((ticket.description), 35)}</td>
                                <td>
                                        <span
                                            className={`badge ${
                                                ticket.status === 'Yanıt Bekliyor' ? 'bg-warning' : 'bg-success'
                                            }`}
                                        >
                                            {ticket.status}
                                        </span>
                                </td>
                                <td>{new Date(ticket.created_at).toLocaleString()}</td>
                                <td className="text-center">
                                    <Link href={`/ticket/${ticket.id}`} className="btn btn-primary me-2">
                                        <FontAwesomeIcon icon={faEye} style={{color: 'white'}}/>
                                    </Link>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteTicket(ticket.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Önceki
                            </button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">{currentPage} / {totalPages}</span>
                        </li>
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Sonraki
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default withAuth(TicketAdmin);
