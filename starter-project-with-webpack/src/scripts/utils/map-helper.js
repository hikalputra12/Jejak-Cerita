// src/scripts/utils/map-helper.js
// Import Leaflet library
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with Webpack
// This is necessary because Webpack changes the path of the images
// and Leaflet's default icon path doesn't know about it.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Store map instances for easy management
const mapInstances = {};

// Function to initialize a map
export function initMap(containerId, lat = -6.2, lon = 106.816666, zoom = 13) {
  // Clear existing map instance if it exists for this container
  if (mapInstances[containerId]) {
    mapInstances[containerId].remove();
    delete mapInstances[containerId];
  }

  const map = L.map(containerId).setView([lat, lon], zoom);

  // Add OpenStreetMap tile layer (default)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  mapInstances[containerId] = map;
  return map;
}

// Function to set a click listener on the map
export function setMapClickListener(map, callback) {
  map.on('click', (e) => {
    callback(e.latlng.lat, e.latlng.lng);
  });
}

// Function to add a marker to the map
export function addMarker(map, lat, lon, popupText = 'Lokasi') {
  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(popupText)
    .openPopup();
}

// Function to clear all markers from a map (or a specific map instance)
export function clearMap(mapOrContainerId) {
    if (typeof mapOrContainerId === 'string' && mapInstances[mapOrContainerId]) {
        // Clear a specific map by container ID
        mapInstances[mapOrContainerId].eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapInstances[mapOrContainerId].removeLayer(layer);
            }
        });
    } else if (mapOrContainerId instanceof L.Map) {
        // Clear a specific map instance
        mapOrContainerId.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapOrContainerId.removeLayer(layer);
            }
        });
    } else {
        // If no specific map is provided, clear all instances
        Object.keys(mapInstances).forEach(key => {
            if (mapInstances[key]) {
                mapInstances[key].remove(); // Remove map container from DOM
                delete mapInstances[key];
            }
        });
    }
}


// Function to get a map instance by its container ID
export function getMapInstance(containerId) {
  return mapInstances[containerId];
}

// Function to show map for a story (used in home-page.js and stories-page.js)
export function showMap(containerId, lat, lon, storyName) {
  const mapDiv = document.getElementById(containerId);
  if (mapDiv) {
    mapDiv.classList.remove('d-none');
    const mapInstance = initMap(containerId, lat, lon, 15); // Zoom closer for single story map
    addMarker(mapInstance, lat, lon, `Lokasi: ${storyName}`);
    mapInstance.invalidateSize(); // Invalidate size after map div becomes visible
    mapInstance.flyTo([lat, lon], 15); // Fly to the location
  }
}

// Optional: Geolocation setup for Add Story page
export function setupGeolocation(mapInstance, latInput, lonInput, mapCoordinatesDisplay) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        mapInstance.setView([latitude, longitude], 13);
        latInput.value = latitude;
        lonInput.value = longitude;
        mapCoordinatesDisplay.textContent = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;
        clearMap(mapInstance); // Clear existing markers
        addMarker(mapInstance, latitude, longitude, 'Lokasi Anda Saat Ini');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        alert('Tidak dapat mengambil lokasi Anda saat ini. Silakan klik peta secara manual.');
      }
    );
  } else {
    alert('Geolocation tidak didukung oleh browser Anda. Silakan klik peta secara manual.');
  }
}