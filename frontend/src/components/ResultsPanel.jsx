import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, Sun, Mountain } from 'lucide-react'

export default function ResultsPanel({ sites, onSiteClick }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="absolute bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="bg-gradient-to-r from-solar-orange to-solar-gold text-white px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">🏆</span>
          <h3 className="font-semibold">Top {sites.length} Sites Found</h3>
        </div>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>

      {/* Sites List */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {sites.slice(0, 10).map((site, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition"
              onClick={() => onSiteClick(site)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`font-bold text-lg ${
                    site.rank === 1 ? 'text-yellow-500' :
                    site.rank === 2 || site.rank === 3 ? 'text-gray-400' :
                    'text-orange-700'
                  }`}>
                    #{site.rank || idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Score: {site.score}/100
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-600 mb-2">
                <MapPin size={14} className="mr-1" />
                {site.coordinates.lat.toFixed(4)}°N, {Math.abs(site.coordinates.lon).toFixed(4)}°W
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center text-gray-600">
                  <Sun size={14} className="mr-1 text-solar-orange" />
                  {site.metrics.solar_irradiance} kWh/m²/day
                </div>
                <div className="flex items-center text-gray-600">
                  <Mountain size={14} className="mr-1 text-solar-green" />
                  {site.metrics.slope}° slope
                </div>
              </div>

              <button className="mt-2 text-xs text-solar-blue hover:text-solar-orange transition">
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
