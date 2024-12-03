import { useContext, useEffect, useState } from 'react';
import Header from "../components/Header";
import withAuth from './hoc/withAuth';
import { UserContext } from "@/contexts/UserContext";

function Courseschedule() {
    const userData = useContext(UserContext);
    const [courses, setCourses] = useState([]); // Başlangıçta boş dizi
    const [activeDay, setActiveDay] = useState(''); // Aktif gün

    // Günler eşlemesi (arka planda İngilizce, ekranda Türkçe)
    const daysMapping = {
        Monday: 'Pazartesi',
        Tuesday: 'Salı',
        Wednesday: 'Çarşamba',
        Thursday: 'Perşembe',
        Friday: 'Cuma',
        Saturday: 'Cumartesi',
        Sunday: 'Pazar'
    };

    // İngilizce günlerin sırası
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        // Aktif günü belirle
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setActiveDay(currentDay);

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
    const schedule = {};

    days.forEach(day => {
        schedule[day] = courses
            .filter(course => course.gün === day) // İngilizce gün filtresi
            .sort((a, b) => a.başlangıç_saati.localeCompare(b.başlangıç_saati)); // Başlangıç saatine göre sırala
    });

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Ders Programı</h1>
                <div className="row">
                    {days.map(day => (
                        <div
                            className={`col-md-6 mb-4`} // Aktif gün için vurgulama
                            key={day}
                        >
                            <div className={`card`}> {/* Aktif gün için stil */}
                                <div className="card-header">
                                    <h5 className={`mb-0 ${activeDay === day ? 'text-primary' : ''}`}>
                                        {daysMapping[day]} {activeDay === day && '(Bugün)'} {/* Türkçe gösterim */}
                                    </h5>
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
