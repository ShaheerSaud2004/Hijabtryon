'use client';

import { useEffect, useRef, useState } from 'react';
import { FaceTracker } from '@/lib/mediapipe';
import { HijabRenderer, HijabStyle } from '@/lib/rendering';
import { Camera, X } from 'lucide-react';

interface ARRendererProps {
  onClose?: () => void;
}

export default function ARRenderer({ onClose }: ARRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceTrackerRef = useRef<FaceTracker | null>(null);
  const hijabRendererRef = useRef<HijabRenderer | null>(null);
  const styleRef = useRef<HijabStyle | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HijabStyle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableStyles, setAvailableStyles] = useState<HijabStyle[]>([]);

  useEffect(() => {
    const initializeAR = async () => {
      try {
        if (!videoRef.current || !canvasRef.current || !overlayCanvasRef.current) {
          return;
        }

        // Set canvas dimensions
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;

        const resizeCanvas = () => {
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          overlayCanvas.width = video.videoWidth || 1280;
          overlayCanvas.height = video.videoHeight || 720;
        };

        video.addEventListener('loadedmetadata', resizeCanvas);

        // Initialize face tracker
        const tracker = new FaceTracker();
        faceTrackerRef.current = tracker;

        // Initialize hijab renderer
        const renderer = new HijabRenderer(overlayCanvas);
        hijabRendererRef.current = renderer;
        const styles = renderer.getAvailableStyles();
        setAvailableStyles(styles);
        const defaultStyle = styles[0];
        setSelectedStyle(defaultStyle);
        styleRef.current = defaultStyle;

        // Set up results callback - use ref to avoid dependency issues
        tracker.setOnResults((results: any) => {
          if (results.faceLandmarks && results.faceLandmarks.length > 0 && styleRef.current) {
            // Ensure canvas dimensions match video
            if (overlayCanvas.width !== video.videoWidth || overlayCanvas.height !== video.videoHeight) {
              overlayCanvas.width = video.videoWidth || 1280;
              overlayCanvas.height = video.videoHeight || 720;
            }
            
            const overlayCtx = overlayCanvas.getContext('2d');
            if (overlayCtx && hijabRendererRef.current) {
              // Clear the canvas
              overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
              
              // Render the hijab
              hijabRendererRef.current.renderHijab(
                { landmarks: results.faceLandmarks[0] },
                styleRef.current,
                results.segmentationMask
              );
            }
          }
        });

        // Initialize camera
        await tracker.initialize(video, canvas);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing AR:', err);
        setError('Failed to initialize camera. Please ensure you have granted camera permissions.');
        setIsLoading(false);
      }
    };

    initializeAR();

    return () => {
      if (faceTrackerRef.current) {
        faceTrackerRef.current.stop();
      }
    };
  }, []); // Only run once on mount

  const handleStyleChange = (style: HijabStyle) => {
    setSelectedStyle(style);
    styleRef.current = style; // Update ref immediately
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">AR Try-On Mode</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Video and Canvas */}
      <div className="flex-1 relative flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: 'none' }}
        />
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <p>Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Style Selector */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-white font-semibold mb-4">Select Hijab Style</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {availableStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleChange(style)}
                className={`flex-shrink-0 p-4 rounded-lg border-2 transition-all ${
                  selectedStyle?.id === style.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/30 bg-white/10 hover:bg-white/20'
                }`}
              >
                <div
                  className="w-16 h-16 rounded-full mb-2"
                  style={{ backgroundColor: style.color }}
                />
                <p className="text-white text-sm font-medium">{style.name}</p>
                <p className="text-white/70 text-xs">{style.fabric}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
