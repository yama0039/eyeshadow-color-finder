import React, { useState } from 'react';
import Camera from './components/Camera';
import ColorAnalyzer from './components/ColorAnalyzer';
import ProductList from './components/ProductList';
import './index.css';

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedColor, setExtractedColor] = useState(null);

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
    setExtractedColor(null);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setExtractedColor(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Eyeshadow Finder</h1>
        <p className="subtitle">あなたのための運命の一色を、写真から。</p>
      </header>

      <main>
        {!capturedImage ? (
          <Camera onCapture={handleCapture} />
        ) : (
          <>
            <ColorAnalyzer
              image={capturedImage}
              onColorExtracted={setExtractedColor}
            />
            {extractedColor && (
              <ProductList targetColor={extractedColor} />
            )}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className="btn-primary" onClick={handleReset}>
                もう一度撮影する
              </button>
            </div>
          </>
        )}
      </main>

      <footer style={{ marginTop: '50px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <p>&copy; 2026 BeautyTech AI Lab</p>
      </footer>
    </div>
  );
}

export default App;
