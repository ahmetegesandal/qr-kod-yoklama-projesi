import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(''); // reCAPTCHA token
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/main');
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!username || !password || !recaptchaToken) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Kullanıcı adı, şifre ve doğrulama gereklidir.',
            });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, recaptchaToken }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Giriş başarılı! Yönlendiriliyorsunuz...',
                    timer: 1500,
                    showConfirmButton: false,
                });
                setTimeout(() => {
                    router.push('/main');
                }, 1500);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: data.message || 'Giriş başarısız oldu.',
                });
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center"
             style={{
                 backgroundImage: 'url("/images/bg.jpg")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
             }}>
            <div className="card" style={{ width: '23rem', borderTop: '3px solid var(--bs-primary)', borderBottom: '3px solid var(--bs-primary)' }}>
                <div className="card-body">
                    <div className="text-center mb-3">
                        <img src="/images/logo.png" alt="Logo" style={{height: '135px'}} className="mb-3"/>
                        <h1 style={{color: 'var(--bs-primary)', margin: '0', fontWeight: '700'}}>
                            SYSTT<span style={{color: '#ab8e58'}}>em</span>
                        </h1>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label" for="username">Kullanıcı Adı:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                id="username"
                            />
                        </div>
                        <label className="form-label" for="password">Şifre:</label>
                        <div className="mb-3 input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                id="password"
                            />
                            <span
                                className="input-group-text"
                                style={{cursor: 'pointer'}}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}/>
                            </span>
                        </div>
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={(token) => setRecaptchaToken(token)}
                        />
                        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                            {loading ? 'Yükleniyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
