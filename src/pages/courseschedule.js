import { useContext, useEffect, useState } from 'react';
import Header from "../components/Header";
import withAuth from './hoc/withAuth';
import { UserContext } from "@/contexts/UserContext";

function Courseschedule() {
    const userData = useContext(UserContext);
    const [courses, setCourses] = useState([]); // Başlangıçta boş dizi

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (userData && userData.id) {
                    const response = await fetch(`/api/courseschedule?id=${userData.id}`);

                    if (!response.ok) {
                        throw new Error('API hatası');
                    }

                    const data = await response.json();

                    setCourses(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Ders programı alınamadı:', error);
            }
        };

        fetchCourses();
    }, [userData]);

    // Günlere göre ders programını ayırma ve sıralama
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};

    days.forEach(day => {
        schedule[day] = courses
            .filter(course => course.gün === day)
            .sort((a, b) => a.başlangıç_saati.localeCompare(b.başlangıç_saati)); // Başlangıç saatine göre sırala
    });

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Ders Programı</h1>
                <div className="row">
                    {days.map(day => (
                        <div className="col-md-6 mb-4" key={day}>
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">{day}</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {schedule[day].length > 0 ? (
                                            schedule[day].map((course, index) => (
                                                <li
                                                    className="list-group-item"
                                                    key={course.ders_id || `${day}-${index}`}>
                                                    {`${course.başlangıç_saati} - ${course.bitiş_saati}`} <br/>
                                                    {`Ders: ${course.ders_adı}`} <br/>
                                                    {`Derslik: ${course.derslik}`} <br/>
                                                    {`Öğretim Görevlisi: ${course.öğretim_elemanı}`}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item">Bu günde ders yok.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default withAuth(Courseschedule);
