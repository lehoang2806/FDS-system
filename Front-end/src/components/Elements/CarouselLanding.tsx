import { ImageCarousel1, ImageCarousel2, ImageCarousel3 } from "@/assets/images";
import { useState } from "react";
import Slider from "react-slick";

const images = [
    ImageCarousel1,
    ImageCarousel2,
    ImageCarousel3
];

const CarouselLanding = () => {

    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        infinite: true,          // Lặp lại vòng tròn carousel
        speed: 500,              // Thời gian chuyển slide
        slidesToShow: 1,         // Hiển thị 1 slide
        slidesToScroll: 1,       // Cuộn 1 slide
        autoplay: true,          // Bật autoplay
        autoplaySpeed: 1000,     // Thời gian chuyển slide tự động (3000ms = 3s)
        pauseOnHover: false,   // Dựng khi chuyển slide khi hover
        beforeChange: (_: number, next: number) => setCurrentSlide(next),
    }

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index}>
                        <img src={img} alt={`Slide ${index}`} />
                    </div>
                ))}
            </Slider>

            {/* Pagination nếu muốn */}
            <div className="pagination-lists">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`pagination-item ${currentSlide === index ? "pagination-item-active" : ""}`}
                        onClick={() => setCurrentSlide(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default CarouselLanding;
