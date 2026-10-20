import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Navigation,
  Target,
  Map as MapIcon,
  Crosshair,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";

let L = null;

async function loadLeaflet() {
  if (L) return L;

  const leaflet = await import("leaflet");
  L = leaflet.default || leaflet;
  return L;
}

function MapView({
  destination,
  itinerary,
  activeDay = 0,
  focusLocation = null,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [status, setStatus] = useState("loading");
  const [mapReady, setMapReady] = useState(false);
  const [locations, setLocations] = useState([]);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      try {
        setStatus("loading");
        const leaflet = await loadLeaflet();

        if (!mounted || !mapRef.current || mapInstanceRef.current) {
          return;
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            destination || ""
          )}&limit=1`,
          { headers: { "Accept-Language": "en" } }
        );

        if (!response.ok) {
          throw new Error("Unable to find the destination.");
        }

        const data = await response.json();

        if (!data.length || !mounted) {
          setMapError("Destination not found. Please check the destination name.");
          setStatus("error");
          return;
        }

        const centerCoords = [
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
        ];

        const map = leaflet.map(mapRef.current, {
          center: centerCoords,
          zoom: 12,
          zoomControl: false,
        });

        leaflet.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
          }
        ).addTo(map);

        leaflet.control.zoom({ position: "bottomright" }).addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = leaflet.layerGroup().addTo(map);

        setMapReady(true);
        setStatus("success");
      } catch (error) {
        console.error("Map initialization error:", error);

        if (mounted) {
          setMapError("Unable to load the map. Please check your internet connection.");
          setStatus("error");
        }
      }
    }

    if (destination) {
      initMap();
    } else {
      setStatus("error");
      setMapError("Please provide a destination.");
    }

    return () => {
      mounted = false;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [destination]);
  useEffect(() => {
    if (!itinerary) {
      setLocations([]);
      return;
    }

    const days = Array.isArray(itinerary)
      ? itinerary
      : itinerary.days || [];

    const selectedDay = days[activeDay];

    if (!selectedDay) {
      setLocations([]);
      return;
    }

    const found = [];
    const addLocation = (item, period) => {
      if (typeof item === "string" && item.trim()) {
        found.push({ name: item.trim(), period });
      } else if (item && typeof item === "object") {
        const name =
          item.location ||
          item.place ||
          item.name ||
          item.title;

        if (name) found.push({ name: String(name), period });
      }
    };

    ["morning", "afternoon", "evening", "activities"].forEach((period) => {
      const items = selectedDay[period];

      if (Array.isArray(items)) {
        items.forEach((item) => addLocation(item, period));
      } else if (items) {
        addLocation(items, period);
      }
    });

    setLocations(found);
  }, [itinerary, activeDay]);

  // Geocode itinerary locations and display markers.
  useEffect(() => {
    let cancelled = false;

    async function updateMarkers() {
      const leaflet = await loadLeaflet();
      const map = mapInstanceRef.current;
      const layer = markersLayerRef.current;

      if (!mapReady || !map || !layer || !leaflet) return;

      layer.clearLayers();

      const destinationMarker = leaflet.circleMarker(map.getCenter(), {
        radius: 8,
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.9,
      }).bindPopup(destination || "Destination");

      destinationMarker.addTo(layer);

      const markerLocations = focusLocation
        ? [{ name: focusLocation, period: "Selected location" }]
        : locations;

      const results = await Promise.all(
        markerLocations.map(async (location) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                `${location.name}, ${destination}`
              )}&limit=1`,
              { headers: { "Accept-Language": "en" } }
            );

            if (!response.ok) return null;

            const data = await response.json();

            if (!data.length) return null;

            return {
              ...location,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            };
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      const bounds = [map.getCenter()];

      results.filter(Boolean).forEach((location) => {
        const marker = leaflet.marker([location.lat, location.lon])
          .bindPopup(
            `<strong>${location.name.replace(/[<>&"]/g, "")}</strong><br/>${location.period}`
          );

        marker.addTo(layer);
        bounds.push([location.lat, location.lon]);
      });

      if (focusLocation && results[0]) {
        map.setView([results[0].lat, results[0].lon], 15);
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [35, 35], maxZoom: 13 });
      }
    }

    updateMarkers();

    return () => {
      cancelled = true;
    };
  }, [mapReady, locations, focusLocation, destination]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Trip Map</h3>
            <p className="text-xs text-slate-400">
              {destination || "Your destination"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(13);
            }
          }}
          className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/10"
          title="Zoom in"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <div
          ref={mapRef}
          className="h-[350px] w-full bg-slate-900"
          aria-label={`Map of ${destination || "trip destination"}`}
        />

        <AnimatePresence>
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90"
            >
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              <p className="text-sm text-slate-300">Loading trip map...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/95 p-6 text-center">
            <Navigation className="h-8 w-8 text-amber-400" />
            <p className="text-sm text-slate-300">{mapError}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-xs text-slate-400">
        <Compass className="h-4 w-4 text-emerald-400" />
        <span>
          {focusLocation
            ? `Focused on ${focusLocation}`
            : `${locations.length} itinerary location(s) for Day ${activeDay + 1}`}
        </span>
      </div>
    </div>
  );
}

export default MapView;