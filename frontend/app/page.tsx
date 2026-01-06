import Link from "next/link";
import { Camera, Sparkles, Zap, Shield, TrendingUp, Users, CheckCircle2, ArrowRight, Play, ShoppingBag, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">TryHijab</div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#shopify" className="text-gray-600 hover:text-gray-900 transition-colors">Shopify</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            </div>
            <Link
              href="/dashboard"
              className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              TryHijab
              <br />
              <span className="text-gray-600">Virtual Try-On Powered by AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your hijab brand with cutting-edge virtual try-on technology.
              Increase conversions, reduce returns, and delight customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/ar-mode"
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all flex items-center gap-2 group"
              >
                Try AR Mode
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/photo-mode"
                className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Photo Mode
              </Link>
              <Link
                href="/ai-mode"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                AI Generate
              </Link>
            </div>
          </div>

          {/* Hero Image/Video Placeholder */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">AR Try-On Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for hijab brands with dual-mode technology and seamless Shopify integration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Dual-Mode Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time AR camera overlay for instant try-on, plus photorealistic AI generation for perfect preview photos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">AI-Powered Accuracy</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced face tracking and segmentation ensure perfect hijab placement with proper occlusion and modesty compliance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                AR runs at 30fps on mobile devices. AI generation completes in under 10 seconds.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Privacy First</h3>
              <p className="text-gray-600 leading-relaxed">
                All images processed securely. No permanent storage. Images auto-delete after generation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Proven Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Increase conversion rates by up to 40% and reduce return rates by 30% with virtual try-on.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Shopify Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                One-click Shopify app installation. Automatic product sync. "Try It On" button on every product page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shopify Integration Section */}
      <section id="shopify" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <span className="text-sm font-semibold text-gray-900">Shopify Integration</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Seamless Shopify Integration
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Add virtual try-on to your Shopify store in minutes. One-click installation, zero coding required.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-900">One-Click Install</span>
                    <p className="text-gray-600">Install from Shopify App Store in seconds</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-900">Product Page Embedding</span>
                    <p className="text-gray-600">"Try It On" button automatically added to product pages</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-900">Automatic Sync</span>
                    <p className="text-gray-600">Your hijab products sync automatically with styles and colors</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-900">Conversion Tracking</span>
                    <p className="text-gray-600">Track how try-on affects your sales and conversion rates</p>
                  </div>
                </li>
              </ul>
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center gap-2 group"
                >
                  Install on Shopify
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#"
                  className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  View Demo
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Shopify Store</div>
                      <div className="text-sm text-gray-600">yourstore.myshopify.com</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Product Image</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-semibold text-gray-900 mb-2">Elegant Silk Hijab</div>
                      <div className="text-lg font-bold text-gray-900 mb-4">$49.99</div>
                      <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        Try It On
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Try-On Button
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How We Compare
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See why hijab brands choose us over generic try-on solutions
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left font-semibold text-gray-900">Feature</th>
                  <th className="px-8 py-4 text-center font-semibold text-gray-600">Generic Try-On</th>
                  <th className="px-8 py-4 text-center font-semibold text-gray-900 bg-gray-100">Our Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">Hijab-Specific Design</td>
                  <td className="px-8 py-4 text-center text-gray-500">❌ Generic</td>
                  <td className="px-8 py-4 text-center text-gray-900 font-semibold">✅ Built for Hijabs</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">Dual-Mode (AR + AI)</td>
                  <td className="px-8 py-4 text-center text-gray-500">❌ Single Mode</td>
                  <td className="px-8 py-4 text-center text-gray-900 font-semibold">✅ Both AR & AI</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">Modesty Compliance</td>
                  <td className="px-8 py-4 text-center text-gray-500">⚠️ Basic</td>
                  <td className="px-8 py-4 text-center text-gray-900 font-semibold">✅ Full Coverage</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">Face Tracking Accuracy</td>
                  <td className="px-8 py-4 text-center text-gray-500">~85%</td>
                  <td className="px-8 py-4 text-center text-gray-900 font-semibold">&gt;95%</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">Brand Customization</td>
                  <td className="px-8 py-4 text-center text-gray-500">❌ Limited</td>
                  <td className="px-8 py-4 text-center text-gray-900 font-semibold">✅ Full Control</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">Shopify Integration</td>
                  <td className="px-8 py-4 text-center text-gray-500">⚠️ Complex</td>
                  <td className="px-8 py-4 text-center text-gray-900 font-semibold">✅ One-Click</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">Performance (FPS)</td>
                  <td className="px-8 py-4 text-center text-gray-500">~20fps</td>
                  <td className="px-8 py-4 text-center text-gray-900 font-semibold">30fps+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Transform Your Business
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">For Your Customers</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">See exactly how hijabs look before buying</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Try multiple styles and colors instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Confidence in purchase decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Share beautiful preview images with friends</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">For Your Brand</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">40% increase in conversion rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">30% reduction in return rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Higher average order value</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Competitive differentiation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">One-click Shopify app installation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Brand?
          </h2>
          <p className="text-xl mb-10 text-gray-300">
            Join leading hijab brands using our platform to increase sales and delight customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/ar-mode"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-white mb-2">TryHijab</div>
              <p className="text-sm">Built for hijab brands worldwide</p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2024 TryHijab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
