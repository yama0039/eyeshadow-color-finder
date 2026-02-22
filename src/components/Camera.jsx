import React, { useRef, useState, useCallback, useEffect } from 'react';
import './Camera.css';

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("お使いのブラウザはカメラ機能をサポートしていないか、セキュアな接続（HTTPS）ではありません。");
      return;
    }

    const constraintsList = [
      { video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1080 } }, audio: false },
      { video: { facingMode: 'user' }, audio: false },
      { video: true, audio: false }
    ];

    let lastError = null;
    for (const constraints of constraintsList) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        // 先に状態を更新して、次のレンダリングでvideo要素が現れるようにする
        setStream(mediaStream);
        setIsCameraActive(true);
        return;
      } catch (err) {
        console.warn(`Failed with constraints:`, constraints, err);
        lastError = err;
      }
    }

    // If all failed
    console.error("All camera constraints failed:", lastError);
    const errorMsg = lastError ? ` (${lastError.name})` : "";

    if (lastError?.name === 'NotAllowedError') {
      alert("カメラの使用が許可されていません。ブラウザの設定で許可してください。");
    } else if (lastError?.name === 'NotFoundError') {
      alert("カメラが見つかりませんでした。デバイスにカメラが搭載されているか確認してください。");
    } else {
      alert(`カメラの起動に失敗しました${errorMsg}。他のアプリでカメラを使用していないか確認するか、画像をアップロードしてください。`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCapture(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
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
        <div className="camera-placeholder-container">
          <div className="camera-placeholder" onClick={startCamera}>
            <div className="icon">📷</div>
            <p>カメラを起動</p>
          </div>
          <div className="upload-fallback" onClick={triggerFileUpload}>
            <div className="icon-small">📁</div>
            <p>ライブラリから写真を選択</p>
          </div>
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Camera;
