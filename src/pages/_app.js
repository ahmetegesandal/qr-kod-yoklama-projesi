// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/global.css'; // Other custom styles
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserProvider } from '@/contexts/UserContext';
import { Public_Sans } from 'next/font/google';

const publicSans = Public_Sans({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    style: ['normal', 'italic'],
});

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <UserProvider>
            <div className={publicSans.className}>
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <Component {...pageProps} />
            </div>
        </UserProvider>
    );
}

export default MyApp;
