import { useContext, useEffect, useState } from 'react';
import { UserContext } from "@/contexts/UserContext";
import axios from 'axios';
import Header from "@/components/Header";
import withAuth from './hoc/withAuth';

function RollCall() {
    const userData = useContext(UserContext);
    const userId = userData?.id;

    const [allCourses, setAllCourses] = useState([]); // Tüm yoklama verileri
    const [uniqueCourses, setUniqueCourses] = useState([]); // Tekilleştirilmiş ders listesi
    const [selectedCourse, setSelectedCourse] = useState(null); // Seçilen ders

    useEffect(() => {
        if (userId) {
            axios
                .get(`/api/getStudentCoursesAndAttendance?userId=${userId}`)
                .then((response) => {
                    console.log("API Yanıtı:", response.data.enrichedData);

                    const enrichedData = response.data.enrichedData;

                    // Tüm yoklama verilerini sakla
                    setAllCourses(enrichedData);

                    // Ders seçim listesi için benzersiz dersleri belirle
                    const uniqueList = Array.from(
                        new Map(
                            enrichedData.map((course) => [course.ders_id, course])
                        ).values()
                    );
                    setUniqueCourses(uniqueList);
                })
                .catch((error) => {
                    console.error("API Hatası:", error);
                });
        }
    }, [userId]);

    // Dropdown değişiminde çalışır
    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCourse(courseId || null);
    };

    // Seçilen derse göre filtrelenmiş yoklama kayıtları
    const filteredCourses = selectedCourse
        ? allCourses.filter((course) => course.ders_id === parseInt(selectedCourse))
        : [];

    const formatDateToTurkeyTime = (dateString) => {
        if (!dateString) return "—";
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', options);
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Yoklama Sayfası</h1>
                <div className="mb-3">
                    <label htmlFor="courseSelect" className="form-label">Ders Seçin:</label>
                    <select
                        id="courseSelect"
                        className="form-select"
                        onChange={handleCourseChange}
                        value={selectedCourse || ""}
                    >
                        <option value="">Ders Seçin</option>
                        {uniqueCourses.map((course) => (
                            <option key={course.ders_id} value={course.ders_id}>
                                {course.ders_adı}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <h2 className="mb-3">Yoklama Kayıtları</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-light">
                            <tr>
                                <th>Ders Adı</th>
                                <th>Yoklama Tarihi</th>
                                <th>Başlangıç Saati</th>
                                <th>Bitiş Saati</th>
                                <th>Katılım Durumu</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((record, index) => (
                                    <tr key={`${record.ders_id}-${record.yoklama_tarihi}-${index}`}>
                                        <td>{record.ders_adı}</td>
                                        <td>{formatDateToTurkeyTime(record.yoklama_tarihi)}</td>
                                        <td>{record.baslangic_saati || "—"}</td>
                                        <td>{record.bitis_saati || "—"}</td>
                                        <td>
                                                <span
                                                    className={`badge ${record.katılım_durumu === 'var' ? 'bg-success' : 'bg-danger'}`}
                                                >
                                                    {record.katılım_durumu === 'var' ? 'Katıldı' : 'Katılmadı'}
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        {selectedCourse ? 'Bu ders için kayıt bulunamadı.' : 'Lütfen bir ders seçin.'}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withAuth(RollCall);
