<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let mapContainer;
  let points = $state(0);

  onMount(async () => {
    if (!browser) return;

    // Dynamically import Leaflet only in browser
    const L = await import("leaflet");
    
    // Import Leaflet CSS
    await import("leaflet/dist/leaflet.css");

    // Initialize map
    const map = L.map(mapContainer).setView([19.0760, 72.8777], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(map);

    // Create custom character icon
    const characterIcon = L.icon({
      iconUrl: "/character.png",
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Player position
    let playerLat = 19.0760;
    let playerLng = 72.8777;

    // Add player marker
    const player = L.marker([playerLat, playerLng], {
      icon: characterIcon
    }).addTo(map);

    // Handle arrow key movement
    const handleKeydown = (e) => {
      const step = 0.0005;
      let moved = false;

      if (e.key === "ArrowUp") {
        playerLat += step;
        moved = true;
      }
      if (e.key === "ArrowDown") {
        playerLat -= step;
        moved = true;
      }
      if (e.key === "ArrowRight") {
        playerLng += step;
        moved = true;
      }
      if (e.key === "ArrowLeft") {
        playerLng -= step;
        moved = true;
      }

      if (moved) {
        player.setLatLng([playerLat, playerLng]);
        map.panTo([playerLat, playerLng]);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      map.remove();
    };
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
</svelte:head>

<div class="game-container">
  <div bind:this={mapContainer} class="map"></div>
  
  <div class="game-overlay">
    <div class="top-bar">
      <div class="game-title">
        <span class="title-text">EVO</span>
      </div>
      <div class="stats-panel">
        <div class="stat-item">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{points}</span>
        </div>
      </div>
    </div>

    <div class="controls-panel">
      <button class="game-btn primary" onclick={() => points += 10}>
        <span class="btn-icon">🎯</span>
        Collect
      </button>
      <button class="game-btn" onclick={() => alert('Inventory opened!')}>
        <span class="btn-icon">🎒</span>
        Inventory
      </button>
      <button class="game-btn" onclick={() => alert('Map opened!')}>
        <span class="btn-icon">🗺️</span>
        Map
      </button>
      <button class="game-btn" onclick={() => alert('Settings opened!')}>
        <span class="btn-icon">⚙️</span>
        Settings
      </button>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
  }

  .map {
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .game-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
  }

  .top-bar {
    pointer-events: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .game-title {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    padding: 12px 30px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4),
                inset 0 2px 4px rgba(255, 255, 255, 0.2);
    border: 3px solid #9333ea;
    position: relative;
    overflow: hidden;
  }

  .game-title::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { left: -100%; }
    50%, 100% { left: 100%; }
  }

  .title-text {
    font-size: 32px;
    font-weight: 900;
    color: white;
    text-shadow: 0 0 10px rgba(168, 85, 247, 0.8),
                 0 0 20px rgba(168, 85, 247, 0.5),
                 2px 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 4px;
    position: relative;
    z-index: 1;
  }

  .stats-panel {
    background: linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(109, 40, 217, 0.95) 100%);
    padding: 12px 24px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
    border: 2px solid rgba(168, 85, 247, 0.5);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
  }

  .stat-icon {
    font-size: 24px;
    filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.8));
  }

  .stat-value {
    font-weight: 900;
    color: #fbbf24;
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.6),
                 2px 2px 4px rgba(0, 0, 0, 0.5);
    font-size: 24px;
  }

  .controls-panel {
    pointer-events: auto;
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .game-btn {
    background: linear-gradient(135deg, rgba(88, 28, 135, 0.9) 0%, rgba(109, 40, 217, 0.9) 100%);
    color: white;
    border: 3px solid #a855f7;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4),
                inset 0 1px 2px rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
  }

  .game-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .game-btn:hover::before {
    width: 300px;
    height: 300px;
  }

  .game-btn:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    border-color: #c084fc;
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(124, 58, 237, 0.6),
                inset 0 1px 2px rgba(255, 255, 255, 0.3);
  }

  .game-btn:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.5);
  }

  .game-btn.primary {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    border-color: #c084fc;
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.6),
                inset 0 1px 2px rgba(255, 255, 255, 0.3);
  }

  .game-btn.primary:hover {
    background: linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%);
    box-shadow: 0 12px 28px rgba(124, 58, 237, 0.8);
  }

  .btn-icon {
    font-size: 20px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    position: relative;
    z-index: 1;
  }
</style>