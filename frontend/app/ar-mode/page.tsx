import ARRenderer from '@/components/ARRenderer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ARModePage() {
  return (
    <div className="min-h-screen bg-black">
      <ARRenderer />
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}

