import React, { useRef, useState, useCallback } from 'react';
import './Camera.css';

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false 
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("カメラへのアクセスに失敗しました。");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Make canvas a square based on the center of the video
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    context.drawImage(video, startX, startY, size, size, 0, 0, size, size);
    
    const imageData = canvas.toDataURL('image/jpeg');
    onCapture(imageData);
    stopCamera();
  };

  return (
    <div className="camera-component">
      {!isCameraActive ? (
        <div className="camera-placeholder" onClick={startCamera}>
          <div className="icon">📷</div>
          <p>タップしてカメラを起動</p>
        </div>
      ) : (
        <div className="video-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="video-preview"
          />
          <div className="camera-overlay">
            <div className="target-frame"></div>
          </div>
          <div className="camera-controls">
            <button className="btn-capture" onClick={capturePhoto}>
              <div className="shutter-inner"></div>
            </button>
            <button className="btn-cancel" onClick={stopCamera}>✕</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;
