import { useContext, useEffect, useState } from 'react';
import { UserContext } from "@/contexts/UserContext";
import axios from 'axios';
import Header from "@/components/Header";

function RollCall() {
    const userData = useContext(UserContext);
    const userId = userData?.id;

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        if (userId) {
            axios
                .get(`/api/getStudentCoursesAndAttendance?userId=${userId}`)
                .then((response) => {
                    console.log("API Yanıtı:", response.data.enrichedData);
                    // Gelen verileri tekilleştir
                    const uniqueCourses = Array.from(
                        new Map(
                            response.data.enrichedData.map((course) => [
                                `${course.ders_id}-${course.yoklama_tarihi}`,
                                course,
                            ])
                        ).values()
                    );
                    setCourses(uniqueCourses);
                })
                .catch((error) => {
                    console.error("API Hatası:", error);
                });
        }
    }, [userId]);

    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCourse(courseId || null);
    };

    const filteredCourses = selectedCourse
        ? courses.filter((course) => course.ders_id === parseInt(selectedCourse))
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
                        {courses.map((course) => (
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
                                <th>Katılım Durumu</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((record) => (
                                    <tr key={`${record.ders_id}-${record.yoklama_tarihi}`}>
                                        <td>{record.ders_adı}</td>
                                        <td>{formatDateToTurkeyTime(record.yoklama_tarihi)}</td>
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
                                    <td colSpan="3" className="text-center">
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

export default RollCall;
