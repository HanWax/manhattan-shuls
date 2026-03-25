import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Placeholder synagogue locations scattered across Manhattan neighborhoods
const SYNAGOGUES = [
  { name: 'Upper West Side', lat: 40.7870, lng: -73.9754 },
  { name: 'Upper West Side', lat: 40.7812, lng: -73.9790 },
  { name: 'Upper East Side', lat: 40.7736, lng: -73.9566 },
  { name: 'Upper East Side', lat: 40.7680, lng: -73.9610 },
  { name: 'Midtown', lat: 40.7614, lng: -73.9776 },
  { name: 'Midtown East', lat: 40.7527, lng: -73.9680 },
  { name: 'Murray Hill', lat: 40.7488, lng: -73.9780 },
  { name: 'Gramercy', lat: 40.7382, lng: -73.9850 },
  { name: 'East Village', lat: 40.7265, lng: -73.9838 },
  { name: 'West Village', lat: 40.7340, lng: -73.9990 },
  { name: 'Lower East Side', lat: 40.7150, lng: -73.9880 },
  { name: 'Lower East Side', lat: 40.7185, lng: -73.9850 },
  { name: 'SoHo', lat: 40.7233, lng: -73.9985 },
  { name: 'Tribeca', lat: 40.7163, lng: -74.0086 },
  { name: 'Financial District', lat: 40.7075, lng: -74.0089 },
  { name: 'Chelsea', lat: 40.7465, lng: -73.9960 },
  { name: 'Hell\'s Kitchen', lat: 40.7638, lng: -73.9918 },
  { name: 'Harlem', lat: 40.8116, lng: -73.9465 },
  { name: 'Washington Heights', lat: 40.8400, lng: -73.9390 },
  { name: 'Lincoln Square', lat: 40.7740, lng: -73.9845 },
]

// Star of David SVG marker
function createStarMarker() {
  return L.divIcon({
    className: 'star-marker',
    html: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15,10 9,10" fill="#c4973b" opacity="0.9"/>
      <polygon points="12,22 9,14 15,14" fill="#c4973b" opacity="0.9"/>
    </svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

// Pulsing center marker
function createPulseMarker() {
  return L.divIcon({
    className: 'pulse-marker',
    html: `<div class="pulse-ring"></div><div class="pulse-dot"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function ManhattanMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [40.758, -73.985],
      zoom: 12.5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: false,
    })

    // Use a muted, warm-toned tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 17,
      minZoom: 11,
    }).addTo(map)

    // Add attribution manually for cleaner placement
    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>')
      .addTo(map)

    // Add zoom control on the right
    L.control.zoom({ position: 'topright' }).addTo(map)

    const starIcon = createStarMarker()
    const pulseIcon = createPulseMarker()

    // Add synagogue markers with staggered animation
    SYNAGOGUES.forEach((s, i) => {
      const marker = L.marker([s.lat, s.lng], { icon: starIcon })
      marker.addTo(map)

      // Stagger the appearance
      const el = marker.getElement()
      if (el) {
        el.style.opacity = '0'
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        el.style.transform = 'scale(0.3)'
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'scale(1)'
        }, 300 + i * 80)
      }

      marker.bindTooltip(s.name, {
        className: 'map-tooltip',
        direction: 'top',
        offset: [0, -8],
      })
    })

    // Add a subtle pulse at the center (Midtown)
    L.marker([40.754, -73.984], { icon: pulseIcon }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  return (
    <section className="map-section">
      <div className="map-section-inner">
        <div className="map-text">
          <p className="section-label">Explore the Journey</p>
          <h2 className="section-heading">A&nbsp;Walk Through Manhattan</h2>
          <p className="map-description">
            From Washington Heights to the Financial District, across the Upper West Side
            to the Lower East Side&mdash;each dot marks a synagogue visited, a community
            discovered, a story waiting to be told.
          </p>
          <p className="map-count">
            <span className="map-count-number">20+</span>
            <span className="map-count-label">Synagogues explored across Manhattan&rsquo;s neighborhoods</span>
          </p>
        </div>
        <div className="map-container">
          <div ref={mapRef} className="map" />
          <div className="map-overlay-border" />
        </div>
      </div>
    </section>
  )
}
