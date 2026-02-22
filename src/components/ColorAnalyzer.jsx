import React, { useRef, useEffect, useState } from 'react';
import './ColorAnalyzer.css';

const ColorAnalyzer = ({ image, onColorExtracted }) => {
    const canvasRef = useRef(null);
    const [extractedColor, setExtractedColor] = useState(null);

    useEffect(() => {
        if (image) {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });

                // Draw the captured image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Extract color from the center area
                // We take a small square at the center for sampling
                const sampleSize = 20;
                const x = (canvas.width / 2) - (sampleSize / 2);
                const y = (canvas.height / 2) - (sampleSize / 2);

                const imageData = ctx.getImageData(x, y, sampleSize, sampleSize).data;

                let r = 0, g = 0, b = 0;
                const totalPixels = imageData.length / 4;

                for (let i = 0; i < imageData.length; i += 4) {
                    r += imageData[i];
                    g += imageData[i + 1];
                    b += imageData[i + 2];
                }

                r = Math.round(r / totalPixels);
                g = Math.round(g / totalPixels);
                b = Math.round(b / totalPixels);

                const hex = rgbToHex(r, g, b);
                setExtractedColor(hex);
                onColorExtracted({ r, g, b, hex });
            };
            img.src = image;
        }
    }, [image, onColorExtracted]);

    const rgbToHex = (r, g, b) => {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    };

    return (
        <div className="analyzer-container">
            <div className="captured-image-wrapper">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="preview-canvas"
                />
                <div className="analyzer-overlay">
                    <div className="sample-indicator"></div>
                </div>
            </div>

            {extractedColor && (
                <div className="result-badge">
                    <div className="color-swatch" style={{ backgroundColor: extractedColor }}></div>
                    <div className="color-info">
                        <span className="label">判定された色</span>
                        <span className="hex-value">{extractedColor.toUpperCase()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorAnalyzer;
