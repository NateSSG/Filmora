import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Spinner = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

const Slider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setLoading(true); // Set loading to true when changing slides
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {loading && <Spinner />}
          <Image
            src={slide}
            alt={`Slide ${index + 1}`}
            layout="fill"
            objectFit="cover"
            onLoadingComplete={handleImageLoad}
          />
        </div>
      ))}
    </div>
  );
};

export default Slider;
