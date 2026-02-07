import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom marker icons for ranked sites
const createNumberedIcon = (number, color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: rotate(-45deg);
      ">
        <span style="transform: rotate(45deg);">${number}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

// Component to handle map bounds updates
function MapBoundsUpdater({ sites }) {
  const map = useMap()

  useEffect(() => {
    if (sites && sites.length > 0) {
      const bounds = sites.map(site => [site.coordinates.lat, site.coordinates.lon])
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 })
    }
  }, [sites, map])

  return null
}

export default function MapView({ sites, onSiteClick }) {
  const mapRef = useRef(null)

  const getMarkerColor = (rank) => {
    if (rank === 1) return '#FFD700' // Gold
    if (rank === 2) return '#C0C0C0' // Silver
    if (rank === 3) return '#CD7F32' // Bronze
    return '#FF6B35' // Solar orange for others
  }

  const defaultCenter = [37.0902, -95.7129] // Center of USA
  const defaultZoom = 4

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sites && sites.map((site, index) => (
          <Marker
            key={index}
            position={[site.coordinates.lat, site.coordinates.lon]}
            icon={createNumberedIcon(site.rank, getMarkerColor(site.rank))}
            eventHandlers={{
              click: () => onSiteClick(site),
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-solar-orange">Site #{site.rank}</strong>
                <br />
                Score: {site.score}/100
                {site.location_name && (
                  <>
                    <br />
                    {site.location_name}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBoundsUpdater sites={sites} />
      </MapContainer>

      {(!sites || sites.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 pointer-events-none">
          <div className="text-center text-gray-400">
            <p className="text-lg font-semibold">No sites to display</p>
            <p className="text-sm mt-2">Submit a search query to see results on the map</p>
          </div>
        </div>
      )}
    </div>
  )
}
