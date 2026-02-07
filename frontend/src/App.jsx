import { useState } from 'react'
import Hero from './components/Hero'
import SearchPanel from './components/SearchPanel'
import MapView from './components/MapView'
import ResultsPanel from './components/ResultsPanel'
import SiteDetailModal from './components/SiteDetailModal'
import AgentStatus from './components/AgentStatus'

function App() {
  const [showHero, setShowHero] = useState(true)
  const [searchResults, setSearchResults] = useState(null)
  const [selectedSite, setSelectedSite] = useState(null)
  const [agentStatus, setAgentStatus] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleStartSearch = () => {
    setShowHero(false)
  }

  const handleSearch = async (searchData) => {
    setIsSearching(true)
    setSearchResults(null)
    setAgentStatus([
      { step: 'Parsing your query...', status: 'in_progress', time: null }
    ])

    try {
      // Simulate agent steps
      setTimeout(() => {
        setAgentStatus([
          { step: 'Parsing your query...', status: 'completed', time: 0.3 },
          { step: 'Discovering satellite datasets...', status: 'in_progress', time: null }
        ])
      }, 300)

      setTimeout(() => {
        setAgentStatus(prev => [
          ...prev.slice(0, 1),
          { step: 'Discovering satellite datasets...', status: 'completed', time: 0.5 },
          { step: 'Analyzing locations...', status: 'in_progress', time: null }
        ])
      }, 800)

      // Make API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      })

      const data = await response.json()

      setAgentStatus(prev => [
        ...prev.slice(0, 2),
        { step: `Analyzing ${data.metadata?.locations_analyzed || 2847} locations...`, status: 'completed', time: 2.1 },
        { step: 'Generating AI insights...', status: 'completed', time: 0.8 }
      ])

      setSearchResults(data)
    } catch (error) {
      console.error('Search failed:', error)
      setAgentStatus([
        { step: 'Error occurred', status: 'error', time: null }
      ])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSiteClick = (site) => {
    setSelectedSite(site)
  }

  if (showHero) {
    return <Hero onStartSearch={handleStartSearch} />
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg blur-md opacity-50"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            SolarScope
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-400">
          <a href="#" className="hover:text-orange-400 transition">Home</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Search Panel */}
        <div className="w-full md:w-2/5 overflow-y-auto">
          <SearchPanel
            onSearch={handleSearch}
            isSearching={isSearching}
          />
          {agentStatus.length > 0 && (
            <AgentStatus steps={agentStatus} />
          )}
        </div>

        {/* Right Side - Map View */}
        <div className="hidden md:block md:w-3/5 relative">
          <MapView
            sites={searchResults?.sites || []}
            onSiteClick={handleSiteClick}
          />
          {searchResults && searchResults.sites && searchResults.sites.length > 0 && (
            <ResultsPanel
              sites={searchResults.sites}
              onSiteClick={handleSiteClick}
            />
          )}
        </div>
      </div>

      {/* Site Detail Modal */}
      {selectedSite && (
        <SiteDetailModal
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
        />
      )}
    </div>
  )
}

export default App
