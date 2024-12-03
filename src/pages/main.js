import {useContext, useState } from 'react';
import Link from 'next/link';
import Header from "../components/Header";
import withAuth from './hoc/withAuth';
import { UserContext } from "@/contexts/UserContext";
import Carousel from "../components/Carousel";
import MainCards from "@/components/MainCards";






function Main() {

    const userData = useContext(UserContext);


    return (
        <>
            <Header/>

            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-9">
                        <h5>Duyurular</h5>
                        <Carousel/>
                        <hr className="mx-1"/>
                        <Link href="/ikazlar" className="btn btn-primary d-block mt-5">
                           % Kayıt Yenileme
                        </Link>

                        <MainCards/>
                    </div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-12">
                                <h5>Akademik Danışmanınız</h5>
                                <div className="card text-center mb-3">
                                    <div className="card-body">
                                        <img
                                            src={`/images/uploads/profile_pictures/user_${userData ? userData.studentNumber : 'default'}.jpg`}
                                            alt={`User ${userData ? userData.studentNumber : 'default'} Profile`}
                                            className="rounded-circle"
                                            style={{height: '110px', width: '110px'}}
                                        />
                                        <h5 className="card-title mt-3">Mehmet Talha Çelik</h5>
                                        <p className="card-text">Öğrenci Danışmanı</p>
                                        <p className="card-text">Dahili: 4170</p>
                                        <p className="card-text">Yerleşke: Kemal Gözükara Yerleşkesi</p>
                                        <p className="card-text">mehmettalhacelik@arel.edu.tr</p>
                                        <a href="#" className="btn btn-primary d-block">Mesaj Gönder</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </>
    );
}

export default withAuth(Main);
