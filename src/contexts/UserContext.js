// contexts/UserContext.js
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        const decoded = jwt.decode(token);
        if (!decoded) {
            localStorage.removeItem('token');
            router.push('/sign-in');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${decoded.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    localStorage.removeItem('token');
                    router.push('/sign-in');
                    return;
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                localStorage.removeItem('token');
                router.push('/sign-in');
            }
        };

        fetchUserData();
    }, [router]);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
};
