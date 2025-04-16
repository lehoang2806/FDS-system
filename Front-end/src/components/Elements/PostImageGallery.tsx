import React, { useState } from 'react';
import Lightbox from 'react-awesome-lightbox';

interface PostImageGalleryProps {
    images: string[];
}

const PostImageGallery: React.FC<PostImageGalleryProps> = ({ images }) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const handleImageClick = (index: number) => {
        setLightboxIndex(index);
    };

    const renderImages = () => {
        const count = images.length;

        if (count === 1) {
            return (
                <div className="gallery-single">
                    <img src={images[0]} alt="post" onClick={() => handleImageClick(0)} />
                </div>
            );
        }

        if (count === 2) {
            return (
                <div className="gallery-two">
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`post-${index}`} onClick={() => handleImageClick(index)} />
                    ))}
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="gallery-three">
                    <div className="gallery-three-left">
                        <img src={images[0]} alt="post-0" onClick={() => handleImageClick(0)} />
                    </div>
                    <div className="gallery-three-right">
                        {images.slice(1).map((src, index) => (
                            <img key={index} src={src} alt={`post-${index + 1}`} onClick={() => handleImageClick(index + 1)} />
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="gallery-grid">
                {images.slice(0, 4).map((src, index) => (
                    <div key={index} className="grid-item" onClick={() => handleImageClick(index)}>
                        <img src={src} alt={`post-${index}`} />
                        {index === 3 && images.length > 4 && (
                            <div className="more-overlay">+{images.length - 4}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="post-image-gallery">
            {renderImages()}

            {lightboxIndex !== null && (
                <Lightbox
                    images={images.map((src) => ({ url: src }))}
                    startIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </div>
    );
};

export default PostImageGallery;
