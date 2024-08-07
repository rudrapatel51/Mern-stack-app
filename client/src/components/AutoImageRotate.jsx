// src/components/RotatingImages.js

import React, { useEffect, useState, useRef } from 'react';
import './autoslider.css'

const images = [
    'https://via.placeholder.com/150/0000FF',
    'https://via.placeholder.com/150/FF0000',
    'https://via.placeholder.com/150/00FF00',
    'https://via.placeholder.com/150/FFFF00',
    'https://via.placeholder.com/150/FF00FF'
];

const AutoImageRotate = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        imageRef.current.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }, [currentImageIndex]);

    return (
        <div className="overflow-hidden relative w-full">
            <div ref={imageRef} className="flex transition-transform duration-500 ease-in-out w-full">
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Slide ${index}`} className="w-full flex-shrink-0" />
                ))}
            </div>
        </div>
    );
};


export default AutoImageRotate;
