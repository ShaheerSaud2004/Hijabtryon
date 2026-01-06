'use client';

import { useState, useRef, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Camera, Upload, ArrowLeft, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { FaceTracker } from '@/lib/mediapipe';
import { HijabRenderer, HijabStyle } from '@/lib/rendering';

const availableStyles: HijabStyle[] = [
  { id: '1', name: 'Classic Wrap', color: '#8B4513', fabric: 'chiffon' },
  { id: '2', name: 'Modern Drape', color: '#2C3E50', fabric: 'jersey' },
  { id: '3', name: 'Elegant Style', color: '#E74C3C', fabric: 'silk' },
  { id: '4', name: 'Casual Wrap', color: '#3498DB', fabric: 'cotton' },
  { id: '5', name: 'Formal Style', color: '#9B59B6', fabric: 'satin' },
];

export default function PhotoModePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HijabStyle>(availableStyles[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const faceTrackerRef = useRef<FaceTracker | null>(null);
  const hijabRendererRef = useRef<HijabRenderer | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResultImage(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            handleImageSelect(file);
          }
        }, 'image/jpeg');
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (err) {
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const processImage = async () => {
    if (!selectedImage || !imagePreview || !canvasRef.current) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Load image
      const img = new Image();
      img.onload = async () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Initialize face tracker
        const tracker = new FaceTracker();
        faceTrackerRef.current = tracker;

        // Create a temporary video element for MediaPipe
        const tempVideo = document.createElement('video');
        tempVideo.width = img.width;
        tempVideo.height = img.height;
        tempVideo.src = imagePreview;
        tempVideo.muted = true;
        
        await new Promise((resolve) => {
          tempVideo.onloadedmetadata = () => {
            tempVideo.play();
            resolve(null);
          };
        });

        // Initialize hijab renderer
        const renderer = new HijabRenderer(canvas);
        hijabRendererRef.current = renderer;

        // Process the image with face tracking
        let processed = false;
        tracker.setOnResults((results: any) => {
          if (results.faceLandmarks && results.faceLandmarks.length > 0 && !processed) {
            processed = true;
            
            // Render hijab on the canvas
            renderer.renderHijab(
              { landmarks: results.faceLandmarks[0] },
              selectedStyle,
              results.segmentationMask
            );

            // Convert canvas to image
            const resultDataUrl = canvas.toDataURL('image/png');
            setResultImage(resultDataUrl);
            setIsProcessing(false);
            
            // Clean up
            tracker.stop();
          }
        });

        // Process the image
        await tracker.initialize(tempVideo, canvas);
        
        // Give it a moment to process
        setTimeout(() => {
          if (!processed) {
            setError('Could not detect face in the image. Please try a clearer photo with your face visible.');
            setIsProcessing(false);
            tracker.stop();
          }
        }, 3000);
      };
      
      img.src = imagePreview;
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process image. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleStyleChange = (style: HijabStyle) => {
    setSelectedStyle(style);
    if (resultImage) {
      // Reprocess with new style
      processImage();
    }
  };

  useEffect(() => {
    return () => {
      if (faceTrackerRef.current) {
        faceTrackerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Photo Try-On Mode</h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Upload and Style Selection */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-purple-600" />
                  Upload or Take Photo
                </h2>
                
                {!imagePreview ? (
                  <div className="space-y-4">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      selectedImage={null}
                      isProcessing={false}
                    />
                    <div className="text-center">
                      <span className="text-gray-500 text-sm">or</span>
                    </div>
                    <button
                      onClick={capturePhoto}
                      className="w-full border-2 border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors flex flex-col items-center gap-2"
                    >
                      <Camera className="w-12 h-12 text-gray-400" />
                      <span className="font-semibold text-gray-700">Take Photo with Camera</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                        setResultImage(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Select Hijab Style</h2>
                <div className="grid grid-cols-2 gap-4">
                  {availableStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedStyle.id === style.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-lg mb-2"
                        style={{ backgroundColor: style.color }}
                      />
                      <p className="font-semibold text-gray-900">{style.name}</p>
                      <p className="text-sm text-gray-600">{style.fabric}</p>
                    </button>
                  ))}
                </div>
              </div>

              {imagePreview && (
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      Apply Hijab
                    </>
                  )}
                </button>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Result */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Result</h2>
                {resultImage ? (
                  <div className="relative">
                    <img
                      src={resultImage}
                      alt="Hijab try-on result"
                      className="w-full h-auto rounded-lg"
                    />
                    <a
                      href={resultImage}
                      download="hijab-tryon-result.png"
                      className="absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Upload className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">
                      {imagePreview ? 'Click "Apply Hijab" to see the result' : 'Your result will appear here'}
                    </p>
                  </div>
                )}
              </div>

              {resultImage && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-800">
                    💡 <strong>Tip:</strong> Try different styles or upload a new photo!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

