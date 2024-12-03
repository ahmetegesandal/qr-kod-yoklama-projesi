import React, { useState, useContext } from 'react';
import withAuth from './hoc/withAuth';
import Header from "@/components/Header";
import { UserContext } from "@/contexts/UserContext";

function Register() {
    const userData = useContext(UserContext);

    // Kullanıcı verisi henüz yüklenmediyse veya boşsa, loading veya oturum açma mesajı göster
    if (!userData) {
        return <p>Oturum açmanız gerekiyor...</p>;
    }

    // Kullanıcı admin değilse erişimi engelle
    if (userData.role !== 'admin') {
        return <p>Bu alana erişim yetkiniz yok.</p>;
    }

    // Durum değişkenleri
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [photoFile, setPhotoFile] = useState(null); // Fotoğraf dosyası durumu
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        // Form verilerini toplayın
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('role', userData.role); // userRole admin olmalı
        formData.append('studentNumber', studentNumber); // Öğrenci numarasını ekleyin
        formData.append('photo', photoFile); // Fotoğraf dosyasını ekleyin

        // API isteğini yapın
        const res = await fetch('/api/register', {
            method: 'POST',
            body: formData, // FormData'yı doğrudan gönderin
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        } else {
            setMessage(data.message);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h1 className="mb-4">Kayıt Ol</h1>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Kullanıcı Adı:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Şifre:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="studentNumber" className="form-label">Öğrenci Numarası:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentNumber"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="photoFile" className="form-label">Fotoğraf Yükle:</label>
                        <input
                            type="file"
                            className="form-control"
                            id="photoFile"
                            accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files[0])} // Fotoğraf dosyasını ayarla
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Kayıt Ol</button>
                </form>
                {message && <p className="mt-3 text-danger">{message}</p>} {/* Mesajı hata rengiyle göster */}
            </div>
        </>
    );
}

export default withAuth(Register);
