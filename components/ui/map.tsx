"use client"

import { useEffect, useRef, useCallback } from "react" // <-- Changed from useLayoutEffect
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet"
import { LatLngExpression, Polygon as LeafletPolygon } from "leaflet"

// Define the shape of the data the component will receive
interface MapProps {
  claimData: {
    holderName: string
    claimType: string
    area: string
  }
  onCoordinatesUpdate?: (lat: number, lng: number) => void
}

// --- FIX STARTS HERE ---
// Moved these constants outside the component function
const position: LatLngExpression = [22.9734, 78.6569]
const polygonPositions: LatLngExpression[] = [
  [22.973, 78.655],
  [22.978, 78.658],
  [22.977, 78.665],
  [22.971, 78.662],
  [22.97, 78.659],
]
// --- FIX ENDS HERE ---

/**
 * A helper component that sets a high z-index on the tooltip pane.
 */
function TooltipZIndexManager() {
  const map = useMap()
  useEffect(() => {
    const tooltipPane = map.getPane("tooltipPane")
    if (tooltipPane) {
      tooltipPane.style.zIndex = 650
    }
  }, [map])
  return null
}

/**
 * A component to handle the polygon and its interactions.
 */
function ClaimPolygon({
  positions,
  claimData,
  onCoordinatesUpdate,
}: {
  positions: LatLngExpression[]
  claimData: MapProps["claimData"]
  onCoordinatesUpdate?: MapProps["onCoordinatesUpdate"]
}) {
  const map = useMap()
  const polygonRef = useRef<LeafletPolygon>(null)

  // Use useEffect to ensure the layer is on the map before calculating its center
  useEffect(() => {
    if (polygonRef.current && onCoordinatesUpdate) {
      const centroid = polygonRef.current.getCenter()
      onCoordinatesUpdate(centroid.lat, centroid.lng)
    }
  }, [onCoordinatesUpdate, positions])

  const handleClick = () => {
    if (polygonRef.current) {
      const bounds = polygonRef.current.getBounds()
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  return (
    <Polygon
      ref={polygonRef}
      pathOptions={{ color: "green" }}
      positions={positions}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Tooltip sticky>
        <div className="text-sm">
          <b className="text-green-800">Rights Holder:</b> {claimData.holderName} <br />
          <b className="text-green-800">Claim Type:</b> {claimData.claimType} <br />
          <b className="text-green-800">Area:</b> {claimData.area} <br />
        </div>
      </Tooltip>
    </Polygon>
  )
}

const Map = ({ claimData, onCoordinatesUpdate }: MapProps) => {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-lg"
    >
      <TooltipZIndexManager />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClaimPolygon
        positions={polygonPositions}
        claimData={claimData}
        onCoordinatesUpdate={onCoordinatesUpdate}
      />
    </MapContainer>
  )
}

export default Map