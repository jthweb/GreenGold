import React, { useRef, useEffect, useState, useCallback } from 'react';
import { XMarkIcon, CameraIcon, ArrowPathIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

interface CameraCaptureProps {
    onClose: () => void;
    onCapture: (imageDataUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLocalization();

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError(t('cameraError'));
            // Fallback to user facing camera
             try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setError(null);
            } catch (fallbackErr) {
                 console.error("Error accessing fallback camera:", fallbackErr);
                 setError(t('cameraErrorFallback'));
            }
        }
    }, [t]);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);
                stream?.getTracks().forEach(track => track.stop());
            }
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleUsePhoto = () => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#202a25] rounded-lg shadow-2xl p-4 w-full max-w-lg relative text-slate-800 dark:text-white">
                <button onClick={onClose} className="absolute top-3 end-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors z-10">
                    <XMarkIcon className="w-8 h-8" />
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: '#D4A22E' }}>{t('captureImage')}</h2>
                
                {error && <p className="text-red-500 text-center my-4">{error}</p>}
                
                <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                    {capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                    ) : (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    )}
                </div>
                
                <canvas ref={canvasRef} className="hidden"></canvas>
                
                <div className="mt-6 flex justify-center items-center space-x-4">
                    {capturedImage ? (
                        <>
                            <button onClick={handleRetake} className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-800 dark:text-slate-100 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all transform hover:scale-105">
                                <ArrowPathIcon className="w-6 h-6" />
                                {t('retake')}
                            </button>
                            <button onClick={handleUsePhoto} className="px-8 py-3 rounded-full text-white font-bold transition-all transform hover:scale-105 shadow-lg" style={{ backgroundColor: '#D4A22E' }}>
                                {t('usePhoto')}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleCapture} disabled={!!error} className="p-5 rounded-full text-white disabled:bg-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-110" style={{ backgroundColor: '#D4A22E' }}>
                            <CameraIcon className="w-10 h-10" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CameraCapture;