<script lang="ts">
  import { onMount } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  let mapContainer: HTMLDivElement;
  let map: L.Map;

  onMount(() => {
    map = L.map(mapContainer).setView([19.0760, 72.8777], 17);

    // Default OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    // Add a marker (temporary character)
    const marker = L.marker([19.0760, 72.8777]).addTo(map);

    // GPS tracking
    navigator.geolocation.watchPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      marker.setLatLng([lat, lng]);
      map.setView([lat, lng]);
    });
  });
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
  .map {
    width: 100%;
    height: 100vh;
  }
</style>