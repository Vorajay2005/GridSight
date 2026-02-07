import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const { BaseLayer } = LayersControl

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (rank) => {
  let iconColor = '#cd7f32' // bronze
  let iconSize = [25, 41]

  if (rank === 1) {
    iconColor = '#FFD700' // gold
    iconSize = [35, 51]
  } else if (rank === 2 || rank === 3) {
    iconColor = '#C0C0C0' // silver
    iconSize = [30, 46]
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="${iconSize[0]}" height="${iconSize[1]}" viewBox="0 0 25 41">
          <path d="M12.5,0 C5.6,0 0,5.6 0,12.5 C0,21.9 12.5,41 12.5,41 S25,21.9 25,12.5 C25,5.6 19.4,0 12.5,0 Z" fill="${iconColor}" stroke="#fff" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">${rank}</text>
        </svg>
      </div>
    `,
    iconSize: iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]]
  })
}

function MapController({ sites }) {
  const map = useMap()

  useEffect(() => {
    if (sites && sites.length > 0) {
      const bounds = sites.map(site => [site.coordinates.lat, site.coordinates.lon])
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [sites, map])

  return null
}

export default function MapView({ sites, onSiteClick }) {
  const defaultCenter = [37.0902, -95.7129] // Center of USA
  const defaultZoom = 4

  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </BaseLayer>

          <BaseLayer name="Terrain">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </BaseLayer>
        </LayersControl>

        {sites && sites.map((site, idx) => (
          <Marker
            key={idx}
            position={[site.coordinates.lat, site.coordinates.lon]}
            icon={createCustomIcon(site.rank || idx + 1)}
            eventHandlers={{
              click: () => onSiteClick(site)
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-solar-orange">Site #{site.rank || idx + 1}</div>
                {site.location_name && (
                  <div className="font-semibold text-gray-800">{site.location_name}</div>
                )}
                <div className="text-gray-700">Score: {site.score}/100</div>
                <div className="text-xs text-gray-600 mt-1">
                  {site.coordinates.lat.toFixed(4)}°N, {Math.abs(site.coordinates.lon).toFixed(4)}°W
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {sites && sites.length > 0 && <MapController sites={sites} />}
      </MapContainer>
    </div>
  )
}
