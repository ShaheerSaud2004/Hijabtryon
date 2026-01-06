// Dynamic imports for MediaPipe (client-side only)
let FaceMesh: any;
let SelfieSegmentation: any;

export interface FaceLandmarks {
  landmarks: Array<{ x: number; y: number; z: number }>;
  multiFaceLandmarks: Array<Array<{ x: number; y: number; z: number }>>;
}

async function loadMediaPipe() {
  if (typeof window === 'undefined') {
    throw new Error('MediaPipe can only be used in the browser');
  }
  
  if (!FaceMesh || !SelfieSegmentation) {
    const faceMeshModule = await import('@mediapipe/face_mesh');
    const selfieSegModule = await import('@mediapipe/selfie_segmentation');
    FaceMesh = faceMeshModule.FaceMesh;
    SelfieSegmentation = selfieSegModule.SelfieSegmentation;
  }
  return { FaceMesh, SelfieSegmentation };
}

export class FaceTracker {
  private faceMesh: any;
  private selfieSegmentation: any;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private onResultsCallback?: (results: any) => void;
  private initialized: boolean = false;

  setOnResults(callback: (results: any) => void) {
    this.onResultsCallback = callback;
  }

  async initialize(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    if (this.initialized) {
      return;
    }

    // Load MediaPipe modules dynamically
    const { FaceMesh: FM, SelfieSegmentation: SS } = await loadMediaPipe();

    this.faceMesh = new FM({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    this.selfieSegmentation = new SS({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
      },
      modelSelection: 1, // 0 for general, 1 for landscape
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.selfieSegmentation.setOptions({
      modelSelection: 1,
    });

    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.initialized = true;

    // Set up results handlers
    let segResultsCache: any = null;

    this.selfieSegmentation.onResults((segResults: any) => {
      segResultsCache = segResults;
      this.faceMesh.send({ image: segResults.image });
    });

    this.faceMesh.onResults((faceResults: any) => {
      if (segResultsCache) {
        const results = {
          ...faceResults,
          segmentationMask: segResultsCache.segmentationMask,
          image: segResultsCache.image,
        };
        
        if (this.canvasElement) {
          const ctx = this.canvasElement.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            ctx.drawImage(results.segmentationMask, 0, 0, this.canvasElement.width, this.canvasElement.height);
            
            // Only overwrite existing pixels
            ctx.globalCompositeOperation = 'source-in';
            ctx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
            
            // Restore original composite operation
            ctx.globalCompositeOperation = 'source-over';
          }
        }

        if (this.onResultsCallback) {
          this.onResultsCallback({
            faceLandmarks: results.multiFaceLandmarks,
            segmentationMask: results.segmentationMask,
            image: results.image,
          });
        }
      }
    });

    // Start camera using native browser API
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });

      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        await this.videoElement.play();

        // Start processing frames
        const processFrame = async () => {
          if (this.videoElement && this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
            await this.selfieSegmentation.send({ image: this.videoElement });
          }
          this.animationFrameId = requestAnimationFrame(processFrame);
        };

        this.videoElement.addEventListener('loadedmetadata', () => {
          if (this.canvasElement && this.videoElement) {
            this.canvasElement.width = this.videoElement.videoWidth;
            this.canvasElement.height = this.videoElement.videoHeight;
          }
          processFrame();
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw new Error('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }
}
