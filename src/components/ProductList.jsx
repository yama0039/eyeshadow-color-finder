import React, { useMemo } from 'react';
import './ProductList.css';

// Mock product data
const PRODUCTS = [
    { id: 1, brand: 'Luster Cosmetics', name: 'Golden Sunset', hex: '#d4a373', price: '¥3,200', image: 'https://images.unsplash.com/photo-1583241475879-da985E7edc32?w=150&h=150&fit=crop' },
    { id: 2, brand: 'Midnight Muse', name: 'Royal Velvet', hex: '#4b3f72', price: '¥4,500', image: 'https://images.unsplash.com/photo-1590156221122-c748e7898a23?w=150&h=150&fit=crop' },
    { id: 3, brand: 'Ethereal Glow', name: 'Rose Quartz', hex: '#e5989b', price: '¥2,800', image: 'https://images.unsplash.com/photo-1590156221122-c748e7898a23?w=150&h=150&fit=crop' },
    { id: 4, brand: 'Terra Aura', name: 'Sienna Dust', hex: '#a44a3f', price: '¥3,800', image: 'https://images.unsplash.com/photo-1590156221122-c748e7898a23?w=150&h=150&fit=crop' },
    { id: 5, brand: 'Luster Cosmetics', name: 'Icy Platinum', hex: '#e5e5e5', price: '¥3,200' },
    { id: 6, brand: 'Velvet Veil', name: 'Espresso Bean', hex: '#3d2b1f', price: '¥3,500' },
    { id: 7, brand: 'Pure Skin', name: 'Peach Fizz', hex: '#ffbe0b', price: '¥2,100' },
    { id: 8, brand: 'Urban Noir', name: 'Graphite Shine', hex: '#333533', price: '¥4,000' },
    { id: 9, brand: 'Flora', name: 'Lavender Mist', hex: '#b5a4a3', price: '¥2,500' }
];

// Helper to calculate color distance (simple Euclidean distance in RGB)
const calculateDistance = (c1, c2) => {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
};

// Convert hex to RGB for distance calculation
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const ProductList = ({ targetColor }) => {
    const recommendations = useMemo(() => {
        if (!targetColor) return [];

        return PRODUCTS.map(product => {
            const productRgb = hexToRgb(product.hex);
            const distance = calculateDistance(targetColor, productRgb);
            const similarity = Math.max(0, 100 - (distance / 4.41)); // Rough percentage
            return { ...product, similarity: Math.round(similarity) };
        })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);
    }, [targetColor]);

    return (
        <div className="product-list-container">
            <h3>おすすめの類似商品</h3>
            <div className="product-grid">
                {recommendations.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-visual">
                            <div className="swatch-large" style={{ backgroundColor: product.hex }}></div>
                            <div className="similarity-tag">{product.similarity}% Match</div>
                        </div>
                        <div className="product-details">
                            <span className="brand">{product.brand}</span>
                            <span className="name">{product.name}</span>
                            <span className="price">{product.price}</span>
                            <button className="btn-view">詳細を見る</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
