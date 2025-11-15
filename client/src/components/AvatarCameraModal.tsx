import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarCameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
}

const AvatarCameraModal: React.FC<AvatarCameraModalProps> = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const stopCamera = useCallback(() => {
        // Truy cập trực tiếp stream từ video ref để tránh phụ thuộc vào state `stream`
        if (videoRef.current && videoRef.current.srcObject) {
            const currentStream = videoRef.current.srcObject as MediaStream;
            currentStream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        // Dọn dẹp state để UI được reset cho lần mở tiếp theo
        setStream(null);
    }, []); // Không có dependencies, callback này sẽ ổn định

    const startCamera = useCallback(async () => {
        setError(null);
        setCapturedImage(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
            } catch (err) {
                console.error("Lỗi truy cập camera:", err);
                setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập trong trình duyệt của bạn.");
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        // Hàm dọn dẹp để đảm bảo camera luôn được tắt khi component unmount
        return () => {
            stopCamera();
        };
    }, [isOpen, startCamera, stopCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                setCapturedImage(canvas.toDataURL('image/png'));
                stopCamera();
            }
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleSave = () => {
        if (canvasRef.current) {
            canvasRef.current.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], 'avatar.png', { type: 'image/png' });
                    onCapture(file);
                    onClose();
                }
            }, 'image/png');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-lg relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Chụp ảnh đại diện</h3>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                            <div className="bg-gray-200 rounded-md overflow-hidden aspect-video relative flex items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${capturedImage ? 'hidden' : ''}`}></video>
                                {capturedImage && <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />}
                                <canvas ref={canvasRef} className="hidden"></canvas>
                                {!stream && !capturedImage && !error && <Camera className="w-16 h-16 text-gray-400" />}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-center gap-4 rounded-b-lg">
                            {!capturedImage ? (
                                <button
                                    onClick={handleCapture}
                                    disabled={!stream}
                                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <Camera className="w-5 h-5" /> Chụp
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleRetake} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors">
                                        Chụp lại
                                    </button>
                                    <button onClick={handleSave} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors flex items-center gap-2">
                                        <Check className="w-5 h-5" /> Lưu ảnh
                                    </button>
                                </>
                            )}
                        </div>
                        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AvatarCameraModal;
