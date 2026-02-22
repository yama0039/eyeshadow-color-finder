import React, { useMemo } from 'react';
import productsData from '../data/products.json';
import './ProductList.css';

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

        return productsData.map(product => {
            const productRgb = hexToRgb(product.hex);
            if (!productRgb) return { ...product, similarity: 0 };

            const distance = calculateDistance(targetColor, productRgb);
            // Rough percentage (max distance in RGB is ~441)
            const similarity = Math.max(0, 100 - (distance / 4.41));
            return { ...product, similarity: Math.round(similarity) };
        })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 6); // Show top 6
    }, [targetColor]);

    return (
        <div className="product-list-container">
            <h3>おすすめの類似商品 (日本国内ブランド)</h3>
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
