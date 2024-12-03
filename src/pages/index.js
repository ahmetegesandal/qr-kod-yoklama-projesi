// pages/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        // Yalnızca ana sayfa isteğinde yönlendirme
        router.push('/sign-in');
    }, [router]);

    return (
        <div>
            {/* Boş bir sayfa */}
        </div>
    );
}
