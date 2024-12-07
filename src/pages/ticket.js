// pages/ticket.js
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import { UserContext } from "@/contexts/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import withAuth from './hoc/withAuth';


function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function Ticket() {
    const [tickets, setTickets] = useState([]);
    const { id: userId } = useContext(UserContext) || {};
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!userId) {
            console.warn('User ID is undefined. Cannot fetch tickets.');
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await fetch(`/api/tickets?userId=${userId}`);
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
    }, [userId]);

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        const filteredTickets = tickets.filter(ticket =>
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Ters sıralama işlemi
        const reversedTickets = filteredTickets.reverse();

        setCurrentData(reversedTickets.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, tickets, searchTerm]);

    const totalPages = Math.ceil(tickets.length / itemsPerPage);

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h4 className="mb-4">Kullanıcı Ticket Listesi</h4>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Arama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>

                {/* Yeni Ticket Oluşturma Butonu */}
                <Link href="/ticketadd">
                    <button className="btn btn-primary mb-3">Yeni Ticket Oluştur</button>
                </Link>

                <div className="table-responsive"> {/* Tabloyu çevreleyen div */}
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>Kategori</th> {/* Yeni kategori sütunu */}
                            <th>Konu</th>
                            <th>Açıklama</th>
                            <th>Durum</th> {/* Yeni durum sütunu */}
                            <th>Oluşturulma Zamanı</th>
                            <th>Detay</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentData.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.categoryName || 'Belirtilmemiş'}</td>
                                {/* Yeni kategori sütunu */}
                                <td>{truncateText((ticket.subject), 15)}</td>
                                <td>{truncateText((ticket.description), 35)}</td>
                                <td>
                                <span className={`badge ${ticket.status === 'Yanıt Bekliyor' ? 'bg-warning' : 'bg-success'}`}>
                                    {ticket.status}
                                </span>
                                </td>
                                <td>{new Date(ticket.created_at).toLocaleString()}</td>
                                <td className="text-center">
                                    <Link href={`/ticket/${ticket.id}`} className="btn btn-sm btn-primary">
                                        <FontAwesomeIcon icon={faEye} style={{color: 'white'}}/>
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

export default withAuth(Ticket);
