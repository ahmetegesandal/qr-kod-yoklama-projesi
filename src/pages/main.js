import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from "../components/Header";
import withAuth from './hoc/withAuth';
import { UserContext } from "@/contexts/UserContext";
import Carousel from "../components/Carousel";
import MainCards from "@/components/MainCards";

function Main() {
    const userData = useContext(UserContext);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        if (userData && userData.id) {
            fetch(`/api/getStudentInstructors?studentId=${userData.id}`)
                .then((response) => response.json())
                .then((data) => {
                    setInstructors(data.instructors || []);
                })
                .catch((error) => {
                    console.error("Hoca bilgileri alınamadı:", error);
                });
        }
    }, [userData]);

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="row">
                    {/* Duyurular ve Ana Kartlar Bölümü */}
                    <div className="col-lg-9 col-md-7 col-12">
                        <h5>Duyurular</h5>
                        <Carousel />

                        <MainCards />
                    </div>

                    {/* Akademik Danışman Bölümü */}
                    <div className="col-lg-3 col-md-5 col-12 mt-4 mt-md-0">
                        <h5>Akademik Danışmanınız</h5>
                        <div className="card text-center mb-3">
                            <div className="card-body">
                                <img
                                    src={`/images/uploads/profile_pictures/user_${userData ? userData.studentNumber : 'default'}.jpg`}
                                    alt={`User ${userData ? userData.studentNumber : 'default'} Profile`}
                                    className="rounded-circle mx-auto"
                                    style={{
                                        height: '90px',
                                        width: '90px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <h6 className="card-title mt-3">Mehmet Talha Çelik</h6>
                                <p className="card-text small">Öğrenci Danışmanı</p>
                                <p className="card-text small">Dahili: 4170</p>
                                <p className="card-text small">Yerleşke: Kemal Gözükara Yerleşkesi</p>
                                <p className="card-text small">mehmettalhacelik@arel.edu.tr</p>
                                <a href="#" className="btn btn-outline-primary btn-sm d-block mt-3">
                                    Mesaj Gönder
                                </a>
                            </div>
                        </div>
                        <h5>Akademisyenlerimiz</h5>
                        <div className="instructors-container">
                            {instructors.length > 0 ? (
                                instructors.map((instructor, index) => (
                                    <div className="card text-center mb-3" key={index}>
                                        <div className="card-body">
                                            <img
                                                src={`/images/uploads/profile_pictures/${instructor.photo}`}
                                                alt={`${instructor.unvan}`}
                                                className="rounded-circle mx-auto"
                                                style={{
                                                    height: '90px',
                                                    width: '90px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <h6 className="card-title mt-3">
                                                {instructor.unvan} {instructor.isim} {instructor.soyisim}
                                            </h6>
                                            <p className="card-text small">Mail: {instructor.email}</p>
                                            <p className="card-text small">Dahili: {instructor.telefon}</p>
                                            <p className="card-text small">Yerleşke: {instructor.yerleske}</p>
                                            <a href={`mailto:${instructor.email}`}
                                               className="btn btn-outline-primary btn-sm d-block mt-3">
                                                Mesaj Gönder
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Henüz akademisyen bilgisi bulunmamaktadır.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default withAuth(Main);
