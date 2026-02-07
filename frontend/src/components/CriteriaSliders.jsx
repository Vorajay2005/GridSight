import { useState, useEffect } from 'react'

export default function CriteriaSliders({ weights, onChange }) {
  const [localWeights, setLocalWeights] = useState(weights)

  useEffect(() => {
    setLocalWeights(weights)
  }, [weights])

  const handleSliderChange = (key, value) => {
    const newWeights = { ...localWeights, [key]: parseInt(value) }
    setLocalWeights(newWeights)
    onChange(newWeights)
  }

  const autoBalance = () => {
    const balanced = {
      irradiance: 25,
      slope: 25,
      grid_distance: 25,
      land_cover: 25
    }
    setLocalWeights(balanced)
    onChange(balanced)
  }

  const total = Object.values(localWeights).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Criteria Weights</h3>
        <button
          type="button"
          onClick={autoBalance}
          className="text-xs text-cyan-400 hover:text-orange-400 transition"
        >
          Auto-balance
        </button>
      </div>

      {/* Solar Irradiance */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          ☀️ Solar Irradiance: {localWeights.irradiance}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={localWeights.irradiance}
          onChange={(e) => handleSliderChange('irradiance', e.target.value)}
          className="w-full accent-orange-500"
        />
      </div>

      {/* Terrain Slope */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          ⛰️ Terrain Slope: {localWeights.slope}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={localWeights.slope}
          onChange={(e) => handleSliderChange('slope', e.target.value)}
          className="w-full accent-orange-500"
        />
      </div>

      {/* Grid Distance */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          ⚡ Grid Distance: {localWeights.grid_distance}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={localWeights.grid_distance}
          onChange={(e) => handleSliderChange('grid_distance', e.target.value)}
          className="w-full accent-orange-500"
        />
      </div>

      {/* Land Cover */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          🌱 Land Cover: {localWeights.land_cover}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={localWeights.land_cover}
          onChange={(e) => handleSliderChange('land_cover', e.target.value)}
          className="w-full accent-orange-500"
        />
      </div>

      {/* Total */}
      <div className={`text-sm text-right ${total === 100 ? 'text-green-400' : 'text-red-400'}`}>
        Total: {total}% {total !== 100 && '(should equal 100%)'}
      </div>
    </div>
  )
}
