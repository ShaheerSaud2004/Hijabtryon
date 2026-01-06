'use client';

import { useState } from 'react';
import { Plus, Upload, Palette, X, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

interface HijabStyle {
  id: string;
  name: string;
  color: string;
  fabric: string;
  texture?: string;
}

export default function DashboardPage() {
  const [styles, setStyles] = useState<HijabStyle[]>([
    { id: '1', name: 'Classic Wrap', color: '#8B4513', fabric: 'chiffon' },
    { id: '2', name: 'Modern Drape', color: '#2C3E50', fabric: 'jersey' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newStyle, setNewStyle] = useState({
    name: '',
    color: '#8B4513',
    fabric: 'chiffon',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fabrics = ['chiffon', 'jersey', 'silk', 'cotton', 'satin', 'jersey'];

  const handleAddStyle = () => {
    if (newStyle.name && newStyle.color && newStyle.fabric) {
      const style: HijabStyle = {
        id: Date.now().toString(),
        ...newStyle,
      };
      setStyles([...styles, style]);
      setNewStyle({ name: '', color: '#8B4513', fabric: 'chiffon' });
      setIsAdding(false);
    }
  };

  const handleDeleteStyle = (id: string) => {
    setStyles(styles.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save styles
      alert('Styles saved successfully!');
    } catch (error) {
      console.error('Error saving styles:', error);
      alert('Failed to save styles');
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Brand Dashboard</h1>
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
            <p className="text-purple-100">
              Manage your hijab styles, colors, and fabrics. Upload your products and customize the try-on experience for your customers.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">{styles.length}</div>
              <div className="text-gray-600">Hijab Styles</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {new Set(styles.map((s) => s.fabric)).size}
              </div>
              <div className="text-gray-600">Fabric Types</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-rose-600 mb-2">
                {new Set(styles.map((s) => s.color)).size}
              </div>
              <div className="text-gray-600">Colors</div>
            </div>
          </div>

          {/* Styles Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Hijab Styles</h2>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Style
              </button>
            </div>

            {/* Add New Style Form */}
            {isAdding && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Style</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style Name
                    </label>
                    <input
                      type="text"
                      value={newStyle.name}
                      onChange={(e) => setNewStyle({ ...newStyle, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Classic Wrap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={newStyle.color}
                        onChange={(e) => setNewStyle({ ...newStyle, color: e.target.value })}
                        className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newStyle.color}
                        onChange={(e) => setNewStyle({ ...newStyle, color: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="#8B4513"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fabric Type
                    </label>
                    <select
                      value={newStyle.fabric}
                      onChange={(e) => setNewStyle({ ...newStyle, fabric: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {fabrics.map((fabric) => (
                        <option key={fabric} value={fabric}>
                          {fabric.charAt(0).toUpperCase() + fabric.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddStyle}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Style
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewStyle({ name: '', color: '#8B4513', fabric: 'chiffon' });
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Styles Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {styles.map((style) => (
                <div
                  key={style.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{style.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{style.fabric}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteStyle(style.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div
                    className="w-full h-32 rounded-lg mb-4"
                    style={{ backgroundColor: style.color }}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Palette className="w-4 h-4" />
                    <span>{style.color}</span>
                  </div>
                </div>
              ))}
            </div>

            {styles.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No styles yet. Add your first hijab style to get started!</p>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Upload Fabric Textures</h2>
            <p className="text-gray-600 mb-4">
              Upload high-quality images of your fabric textures to enhance the try-on experience.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Drag and drop fabric images here</p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Select Files
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

