import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { identifyPlant } from './api';

export default function PlantRecognizer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Initialize camera
  const startCamera = async () => {
    setError('');
    try {
      // Request rear camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied or unavailable. Please check permissions.');
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Capture frame and identify
  const captureAndIdentify = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setLoading(true);
    setError('');
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get base64 image (Plant.id accepts base64 data URIs)
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      
      // Send to API
      const plantData = await identifyPlant(base64Image);
      setResult(plantData);
      
      // Optionally stop camera after successful capture
      // stopCamera();
    } catch (err) {
      setError(err.message || 'Failed to analyze the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 min-h-[400px] rounded-2xl shadow-lg relative overflow-hidden">
      
      {!stream && !result && (
        <button 
          onClick={startCamera}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-transform transform active:scale-95"
        >
          <Camera size={20} />
          Open Camera
        </button>
      )}

      {/* Camera View */}
      <div className={`relative w-full max-w-md aspect-[3/4] bg-black rounded-xl overflow-hidden ${stream && !result ? 'block' : 'hidden'}`}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Capture Overlay UI */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button 
            onClick={captureAndIdentify}
            disabled={loading}
            className="w-16 h-16 bg-white rounded-full border-4 border-green-500 shadow-xl flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin text-green-600" size={24} /> : <div className="w-12 h-12 bg-white rounded-full" />}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 max-w-md w-full">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{result.name}</h3>
            <p className="text-sm text-gray-500 italic mb-4">{result.species}</p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Watering</p>
                  <p className="text-sm text-gray-800">{result.watering}</p>
                </div>
                <div className="flex-1 bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wider mb-1">Sunlight</p>
                  <p className="text-sm text-gray-800">{result.sunlight}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {result.description}
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setResult(null);
                if (!stream) startCamera();
              }}
              className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Scan Another Plant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
