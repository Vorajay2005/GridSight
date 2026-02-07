import { Sun, Zap, MapPin, Sparkles, ArrowRight, Database, Brain, Globe } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'

export default function Hero({ onStartSearch }) {
  const exampleQueries = [
    "50-acre solar farm in Arizona with high irradiance",
    "Solar installation in California, flat terrain",
    "30-acre solar site in Texas near grid infrastructure"
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative container mx-auto px-6 py-8">
        {/* Logo and Navigation */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-2xl">
                <Sun className="text-white" size={32} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                GridSight
              </h1>
              <p className="text-xs text-orange-400 font-semibold">AI-Powered Site Discovery</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <span className="text-green-400 text-sm font-semibold">● Live</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
          {/* Hero Content - Centered */}
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-500/30 backdrop-blur-sm">
              <Sparkles className="text-orange-400" size={16} />
              <span className="text-sm font-semibold text-orange-300">Powered by Google Earth Engine & Gemini AI</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              Find Perfect
              <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Solar Sites
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-2">
                In Minutes
              </span>
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Leverage AI and satellite imagery to discover optimal renewable energy locations.
              Analyze terrain, irradiance, and infrastructure in real-time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStartSearch}
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl font-bold text-white text-lg shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Start Searching</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl font-bold text-white text-lg border-2 border-white/20 hover:bg-white/20 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  100+
                </div>
                <div className="text-xs text-gray-400 mt-1 font-semibold">Real Locations</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  10+
                </div>
                <div className="text-xs text-gray-400 mt-1 font-semibold">Data Sources</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  24
                </div>
                <div className="text-xs text-gray-400 mt-1 font-semibold">US States</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real Satellite Data</h3>
            <p className="text-gray-400">Analyze solar irradiance, terrain slope, and land cover using Google Earth Engine's global datasets</p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Intelligence</h3>
            <p className="text-gray-400">Multi-agent system powered by Google Gemini AI for intelligent site scoring and natural language queries</p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nationwide Coverage</h3>
            <p className="text-gray-400">Explore verified solar-suitable locations across 24+ US states with real coordinates and terrain data</p>
          </div>
        </div>

        {/* Example Queries */}
        <div className="mt-16 max-w-3xl mx-auto">
          <p className="text-gray-400 mb-6 text-center flex items-center justify-center space-x-2">
            <Zap className="text-orange-400" size={20} />
            <span className="font-semibold">Try these example searches:</span>
          </p>
          <div className="space-y-3">
            {exampleQueries.map((query, idx) => (
              <div
                key={idx}
                className="group p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="text-orange-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{query}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            Built for Snow Fest Hackathon 2025 | Powered by cutting-edge AI and satellite technology
          </p>
        </div>
      </div>
    </div>
  )
}
