// Create map (same as Mapbox container, center, zoom)
const map = L.map("map").setView(
  [listing.geometry.coordinates[1], listing.geometry.coordinates[0]],
  8,
); // [lat, lng]

// Add OpenStreetMap tiles (replacement for Mapbox style)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// console.log(coordinates);

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.marker([listing.geometry.coordinates[1], listing.geometry.coordinates[0]], {
  icon: redIcon,
})
  .addTo(map)
  .bindPopup(
    `
  <div style="font-family: sans-serif;">
    <h4 style="margin:0;">${listing.title}</h4>
    <p style="margin:0;">Exact Location will be provided after booking</p>
  </div>
`,
  )
  .openPopup();
