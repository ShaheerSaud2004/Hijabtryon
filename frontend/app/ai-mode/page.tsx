'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Sparkles, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

interface HijabStyle {
  id: string;
  name: string;
  color: string;
  fabric: string;
}

const availableStyles: HijabStyle[] = [
  { id: '1', name: 'Classic Wrap', color: '#8B4513', fabric: 'chiffon' },
  { id: '2', name: 'Modern Drape', color: '#2C3E50', fabric: 'jersey' },
  { id: '3', name: 'Elegant Style', color: '#E74C3C', fabric: 'silk' },
  { id: '4', name: 'Casual Wrap', color: '#3498DB', fabric: 'cotton' },
  { id: '5', name: 'Formal Style', color: '#9B59B6', fabric: 'satin' },
];

export default function AIModePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HijabStyle>(availableStyles[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('style', selectedStyle.name);
      formData.append('color', selectedStyle.color);
      formData.append('fabric', selectedStyle.fabric);

      const response = await axios.post('/api/ai/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.response?.data?.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'hijab-tryon-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">AI Try-On Mode</h1>
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
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Upload Your Photo
                </h2>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  isProcessing={isGenerating}
                />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Select Hijab Style</h2>
                <div className="grid grid-cols-2 gap-4">
                  {availableStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
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

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Try-On
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Result */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Generated Result</h2>
                {generatedImage ? (
                  <div className="relative">
                    <img
                      src={generatedImage}
                      alt="Generated hijab try-on"
                      className="w-full h-auto rounded-lg"
                    />
                    <button
                      onClick={handleDownload}
                      className="absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">
                      Your generated image will appear here
                    </p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-800">
                    💡 <strong>Tip:</strong> You can download the image or generate another style!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

