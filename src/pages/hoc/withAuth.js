// hoc/withAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
    // eslint-disable-next-line react/display-name
    return (props) => {
        const [isVerified, setIsVerified] = useState(false); // Doğrulama durumu
        const router = useRouter();

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');

                if (!token) {
                    router.push('/sign-in'); // Token yoksa giriş sayfasına yönlendir
                } else {
                    setIsVerified(true); // Token varsa sayfayı göster
                }
            }
        }, [router]);

        if (!isVerified) {
            return null; // Token doğrulanana kadar boş render et
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
