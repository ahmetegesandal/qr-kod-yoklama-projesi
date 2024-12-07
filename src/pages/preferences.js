// pages/preferences.jsdsasddd

import { useState, useEffect } from "react";
import Header from "../components/Header";
import withAuth from './hoc/withAuth';

function Preferences() {
    const [theme, setTheme] = useState("light");

    // Sayfa yüklendiğinde temayı localStorage'dan oku
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-bs-theme", savedTheme);
    }, []);

    // Tema değiştirme fonksiyonu
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-bs-theme", newTheme);
        localStorage.setItem("theme", newTheme); // Yeni temayı localStorage'a kaydet
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <button
                            className="btn btn-primary"
                            onClick={toggleTheme}
                        >
                            {theme === "light" ? "Dark Mode" : "Light Mode"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withAuth(Preferences);
