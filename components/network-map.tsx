import { networkLocations } from "@/lib/data";

export function NetworkMap() {
  return (
    <div className="network-map" aria-label="Active AfriGate logistics network">
      <svg viewBox="0 0 760 430" role="img" aria-hidden="true">
        <path className="africa-shape" d="M306 38l53 7 46 33 70-2 41 39 55 27 20 49-34 65-41 17-23 62-35 57-47-15-28-58-33-50-38-28-11-47-45-17-19-46 23-44-12-49 38-37z" />
        <path className="route-line" d="M245 164 C390 65 520 140 525 232" />
        <path className="route-line second" d="M525 232 C410 260 430 340 438 349" />
        <path className="route-line third" d="M344 208 C300 160 260 175 190 207" />
      </svg>
      {networkLocations.map((location) => (
        <div className="map-node" style={{ left: `${location.x}%`, top: `${location.y}%` }} key={location.city}>
          <span style={{ width: `${12 + location.volume / 8}px`, height: `${12 + location.volume / 8}px` }} />
          <div><strong>{location.city}</strong><small>{location.country}</small></div>
        </div>
      ))}
      <div className="map-legend"><span><i className="map-active" /> Active hub</span><span><i className="map-route" /> Trade route</span></div>
    </div>
  );
}
