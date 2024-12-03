import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import withAuth from '../hoc/withAuth';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';

const DynamicCKEditor = dynamic(() => import('@/components/CustomEditor'), {
    ssr: false, // Disable server-side rendering for CKEditor
});

function TicketDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [showMessageInput, setShowMessageInput] = useState(false);

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem('token');
            console.log('Fetching ticket details for ID:', id); // Ticket ID logla

            fetch(`/api/ticket/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        console.error('Failed to fetch ticket details:', response.status, response.statusText);
                        throw new Error('Ticket bilgileri alınamadı');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Fetched ticket data:', data); // Ticket bilgilerini logla
                    setTicket(data.ticket);
                    setMessages(data.messages);
                })
                .catch((error) => {
                    console.error("Error fetching ticket details:", error);
                });
        }
    }, [id]);

    const handleSendMessage = () => {
        const token = localStorage.getItem('token');
        console.log('Sending message:', { ticketId: id, message: messageText }); // Gönderilecek mesaj logu

        fetch(`/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ticketId: id, message: messageText }),
        })
            .then((response) => {
                console.log('Message API response status:', response.status); // API durum kodu logu
                if (!response.ok) {
                    return response.json().then((data) => {
                        console.error('Backend error message:', data.message); // Backend hata mesajı
                        throw new Error(data.message || 'Mesaj gönderilemedi');
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log('Message successfully sent:', data); // Mesaj gönderimi başarı logu
                console.log('Ticket Status Received:', data.ticketStatus); // Backend'den gelen durum

                setMessages((prevMessages) => {
                    const updatedMessages = [data.message, ...prevMessages];
                    console.log('Updated messages list:', updatedMessages); // Güncellenmiş mesajlar logu
                    return updatedMessages;
                });

                setTicket((prevTicket) => ({
                    ...prevTicket,
                    status: data.ticketStatus,
                }));

                // SweetAlert ile başarı mesajı ve sayfa yenileme
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Mesaj başarıyla gönderildi!',
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.reload(); // SweetAlert kapandıktan sonra sayfayı yenile
                });
            })
            .catch((error) => {
                console.error("Error sending message:", error.message); // Mesaj gönderim hatası logu

                // SweetAlert ile hata mesajı
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: error.message || 'Mesaj gönderilirken bir hata oluştu.',
                    timer: 3000,
                    showConfirmButton: false,
                });
            });
    };

    if (!ticket) {
        return (
            <div className="container mt-4">
                <h4>Detaylar</h4>
                <p>Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <div className="card mb-4">
                    <div className="card-header">
                        <h4>Detaylar</h4>
                    </div>
                    <div className="card-body">
                        <p><strong>Konu:</strong> {ticket.subject}</p>
                        <p><strong>Açıklama:</strong> {ticket.description}</p>
                        <p>
                            <strong>Durum:</strong>{" "}
                            <span
                                className={`badge ${ticket.status === 'Yanıt Bekliyor' ? 'bg-warning' : 'bg-success'}`}
                            >
                {ticket.status}
            </span>
                        </p>
                        <div className="d-flex justify-content-end">
                            <button
                                onClick={() => setShowMessageInput(!showMessageInput)}
                                className="btn btn-primary mb-4"
                            >
                                Yanıtla
                            </button>
                        </div>


                    </div>
                </div>


                <h5>Mesajlar</h5>
                <div className="messages-container">
                    {showMessageInput && (
                        <div className="card mb-3">
                            <div className="card-body">
                                <DynamicCKEditor
                                    data={messageText}
                                    onChange={(data) => {
                                        console.log('Editor data updated:', data); // CKEditor verisi logu
                                        setMessageText(data);
                                    }}
                                />
                                <div className="d-flex justify-content-end">
                                    <button onClick={handleSendMessage} className="btn btn-primary mt-3">
                                        Mesajı Gönder
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.slice().reverse().map((msg) => (
                        <div key={`${msg.id}-${msg.created_at}`} className="card mb-3">
                            <div className="card-body">
                                <h6 className="card-title">
                                    <strong>{msg.name} {msg.surname} ({msg.role}):</strong>
                                </h6>
                                <p className="card-text"
                                   dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(msg.content)}}></p>
                                <p className="card-text">
                                    <small
                                        className="text-muted">Gönderildi: {new Date(msg.created_at).toLocaleString()}</small>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default withAuth(TicketDetail);
