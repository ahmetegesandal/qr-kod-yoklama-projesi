import Slider from "react-slick";
import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Slick CSS dosyalarını ekleyin

const Carousel = () => {
    const settings = {
        dots: true, // Slider altına geçiş noktaları ekler
        infinite: true,
        speed: 500,
        slidesToShow: 1, // Aynı anda gösterilecek slide sayısı
        slidesToScroll: 1, // Her geçişte kayacak slide sayısı
        autoplay: true, // Otomatik geçişi aktif eder
        autoplaySpeed: 3000, // Otomatik geçiş hızını belirler (3 saniye)
        adaptiveHeight: true, // Resim yüksekliğine uyum sağlar
        responsive: [
            {
                breakpoint: 768, // Mobil cihazlar için
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024, // Tabletler için
                settings: {
                    slidesToShow: 2, // Tabletlerde 2 slide göster
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                <div className="slide">
                    <img src="/images/slider1.jpg" alt="Image 1" className="image" />
                </div>
                <div className="slide">
                    <img src="/images/slider2.jpg" alt="Image 2" className="image" />
                </div>
                <div className="slide">
                    <img src="/images/slider3.jpg" alt="Image 3" className="image" />
                </div>
            </Slider>
        </div>
    );
};

export default Carousel;
