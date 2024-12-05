import React, { useState, useContext } from 'react';
import { UserContext } from "@/contexts/UserContext"; // UserContext'i ekliyoruz
import { useRouter } from 'next/router';
import Header from "@/components/Header";
import Swal from 'sweetalert2'; // SweetAlert2'yi ekliyoruz
import withAuth from './hoc/withAuth';

function TicketAdd() {
    const { id: userId } = useContext(UserContext) || {};
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const handleNewTicketSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !subject || !description) {
            Swal.fire({
                icon: 'warning',
                title: 'Uyarı',
                text: "Lütfen tüm alanları doldurun!",
            });
            return; // Gerekli alanlar doldurulmamışsa işlemi durdur
        }

        try {
            const response = await fetch(`/api/tickets?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, description }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Başarılı',
                text: "Ticket başarıyla oluşturuldu!",
            });
            router.push('/ticket'); // Ticketlar sayfasına yönlendir
        } catch (error) {
            console.error("Error creating ticket:", error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: "Ticket oluşturulurken bir hata oluştu.",
            });
        }
    };

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <h4>Yeni Ticket Oluştur</h4>
                <form onSubmit={handleNewTicketSubmit}>
                    <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Konu</label>
                        <input
                            type="text"
                            id="subject"
                            className="form-control"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Açıklama</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Ticket Oluştur</button>
                </form>
            </div>
        </div>
    );
}

export default withAuth(TicketAdd);
