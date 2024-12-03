import Slider from "react-slick";
import React from 'react';

const Carousel = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Otomatik geçişi aktif eder
        autoplaySpeed: 3000, // Otomatik geçiş hızını belirler (3 saniye)
        adaptiveHeight: true // Resim yüksekliğine uyum sağlar
    };

    return (
        <div>
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
