import { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import CriteriaSliders from './CriteriaSliders'

export default function SearchPanel({ onSearch, isSearching }) {
  const [query, setQuery] = useState('')
  const [energyType, setEnergyType] = useState('solar')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [acreage, setAcreage] = useState(50)
  const [region, setRegion] = useState('Arizona')
  const [criteriaWeights, setCriteriaWeights] = useState({
    irradiance: 40,
    slope: 30,
    grid_distance: 20,
    land_cover: 10
  })

  const exampleQueries = [
    "50-acre solar site in Arizona, flat terrain",
    "Solar farm in New Jersey near grid",
    "Solar installation in California, <5° slope"
  ]

  const states = [
    // Southwest (high solar)
    'Arizona', 'Nevada', 'New Mexico', 'Utah',
    // West Coast
    'California', 'Oregon', 'Washington',
    // Mountain/Plains
    'Colorado', 'Wyoming', 'Montana',
    // South Central
    'Texas', 'Oklahoma', 'Kansas',
    // Southeast
    'Florida', 'Georgia', 'North Carolina', 'South Carolina',
    // Northeast
    'New York', 'New Jersey', 'Pennsylvania', 'Massachusetts',
    // Midwest
    'Illinois', 'Iowa', 'Wisconsin', 'Minnesota'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim() && !region) return

    // If user typed a query, don't send region in filters (let Gemini parse it)
    // If no query, use the dropdown region
    const searchPayload = {
      query: query || `${acreage}-acre ${energyType} farm in ${region}`,
      energy_type: energyType,
      filters: {
        acreage,
        criteria_weights: {
          irradiance: criteriaWeights.irradiance / 100,
          slope: criteriaWeights.slope / 100,
          grid_distance: criteriaWeights.grid_distance / 100,
          land_cover: criteriaWeights.land_cover / 100
        }
      }
    }

    // Only include region in filters if no custom query was entered
    if (!query.trim()) {
      searchPayload.filters.region = region
    }

    console.log('Search payload:', searchPayload)
    onSearch(searchPayload)
  }

  const handleExampleClick = (example) => {
    setQuery(example)
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Stars field */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => {
          const size = Math.random() * 2 + 0.5;
          return (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.random() * 0.6 + 0.2,
                animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          );
        })}
      </div>

      {/* Floating solar panel icons */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => {
          const size = 40 + Math.random() * 50;
          return (
            <div
              key={`panel-${i}`}
              className="absolute opacity-8"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animation: `float-solar ${10 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400/40"/>
                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" className="text-orange-400/40"/>
                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" className="text-orange-400/40"/>
                <line x1="30" y1="10" x2="30" y2="90" stroke="currentColor" strokeWidth="1" className="text-orange-400/30"/>
                <line x1="70" y1="10" x2="70" y2="90" stroke="currentColor" strokeWidth="1" className="text-orange-400/30"/>
                <line x1="10" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="1" className="text-orange-400/30"/>
                <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1" className="text-orange-400/30"/>
              </svg>
            </div>
          );
        })}
      </div>

      {/* Subtle gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-400/10 to-transparent rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative p-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          Describe your ideal site
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Use natural language to find the perfect renewable energy location
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Input */}
          <div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 30-acre solar farm in Texas with high irradiance and flat terrain"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-lg focus:border-orange-500 focus:outline-none resize-none text-white placeholder-gray-400"
              rows="3"
            />
          </div>

          {/* Quick Examples */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-orange-500 hover:border-orange-500 text-gray-300 hover:text-white rounded-full text-sm transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Type Tabs */}
          <div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setEnergyType('solar')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  energyType === 'solar'
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                ☀️ Solar
              </button>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-gray-500 cursor-not-allowed relative"
              >
                💨 Wind
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Soon
                </span>
              </button>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-gray-500 cursor-not-allowed relative"
              >
                💧 Hydro
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Soon
                </span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left font-semibold text-white hover:text-orange-400 transition"
            >
              <span>Advanced Filters</span>
              {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                {/* Acreage Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Acreage: {acreage} acres
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={acreage}
                    onChange={(e) => setAcreage(parseInt(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>

                {/* Region Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State/Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                  >
                    {states.map(state => (
                      <option key={state} value={state} className="bg-slate-800">{state}</option>
                    ))}
                  </select>
                </div>

                {/* Criteria Weights */}
                <CriteriaSliders
                  weights={criteriaWeights}
                  onChange={setCriteriaWeights}
                />
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isSearching}
            className={`w-full py-4 rounded-lg font-semibold text-white text-lg flex items-center justify-center space-x-2 transition ${
              isSearching
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105'
            }`}
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Find Optimal Sites</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
