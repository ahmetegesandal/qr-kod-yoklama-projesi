import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import { UserContext } from "@/contexts/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import withAuth from './hoc/withAuth';

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
    const [filterStatus, setFilterStatus] = useState('all'); // "all" veya "pending"

    useEffect(() => {
        if (!userId || !role) {
            console.warn('User ID or role is undefined. Cannot fetch tickets.');
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await fetch(`/api/tickets?userId=${userId}&role=${role}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setTickets(data);
                console.log('Fetched Tickets:', data);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchTickets();
    }, [userId, role]);

    useEffect(() => {
        const filtered = tickets.filter(ticket => {
            // Filtreleme işlemleri
            const matchesSearchTerm =
                ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterStatus === 'all' || (filterStatus === 'pending' && ticket.status === 'Yanıt Bekliyor');
            return matchesSearchTerm && matchesFilter;
        });

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        const reversedTickets = filtered.reverse();

        setFilteredTickets(filtered); // Toplam filtrelenmiş ticketleri sakla
        setCurrentData(reversedTickets.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, tickets, searchTerm, filterStatus]);

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h4 className="mb-4">Kullanıcı Ticket Listesi</h4>

                <div className="d-flex justify-content-between mb-3">
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
                            <th>Konu</th>
                            <th>Açıklama</th>
                            <th>Durum</th>
                            <th>Oluşturulma Zamanı</th>
                            <th>Detay</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentData.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.subject}</td>
                                <td>{ticket.description}</td>
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
                                    <Link href={`/ticket/${ticket.id}`} className="btn btn-primary" >
                                        <FontAwesomeIcon icon={faEye} style={{ color: 'white' }} />
                                    </Link>
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
