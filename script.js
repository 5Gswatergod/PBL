document.addEventListener("DOMContentLoaded", function () {
  // Team intro animation
  const exploreBtn = document.getElementById("exploreBtn");
  const teamIntro = document.getElementById("teamIntro");
  const mapSection = document.getElementById("mapSection");

  exploreBtn.addEventListener("click", function () {
    teamIntro.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      teamIntro.classList.add("hidden");
      mapSection.classList.remove("hidden");
      initMap();
    }, 800);
  });

  // Map initialization
  function initMap() {
    // Convert DMS to decimal degrees for Huajiang Bridge (25°02'08.1"N 121°29'03.8"E)
    const bridgeLat = 25 + 2 / 60 + 8.1 / 3600;
    const bridgeLng = 121 + 29 / 60 + 3.8 / 3600;

    const map = L.map("map").setView([bridgeLat, bridgeLng], 16);

    // Use OpenStreetMap as base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add river polygon (simplified representation)
    const river = L.polygon(
      [
        [bridgeLat + 0.0025, bridgeLng - 0.003],
        [bridgeLat + 0.003, bridgeLng - 0.0015],
        [bridgeLat + 0.0015, bridgeLng + 0.001],
        [bridgeLat - 0.001, bridgeLng + 0.0025],
        [bridgeLat - 0.0025, bridgeLng + 0.003],
        [bridgeLat - 0.0045, bridgeLng + 0.002],
        [bridgeLat - 0.0055, bridgeLng],
        [bridgeLat - 0.005, bridgeLng - 0.0025],
        [bridgeLat - 0.0035, bridgeLng - 0.004],
        [bridgeLat, bridgeLng - 0.0045],
        [bridgeLat + 0.0025, bridgeLng - 0.003],
      ],
      {
        color: "#0891b2",
        fillColor: "#06b6d4",
        fillOpacity: 0.6,
        weight: 2,
      }
    ).addTo(map);

    // Add park area (Huajiang Park)
    const park = L.polygon(
      [
        [bridgeLat + 0.0005, bridgeLng - 0.001],
        [bridgeLat + 0.001, bridgeLng],
        [bridgeLat, bridgeLng + 0.0015],
        [bridgeLat - 0.0015, bridgeLng + 0.002],
        [bridgeLat - 0.0025, bridgeLng + 0.0015],
        [bridgeLat - 0.003, bridgeLng - 0.0005],
        [bridgeLat - 0.002, bridgeLng - 0.0015],
        [bridgeLat - 0.0005, bridgeLng - 0.002],
        [bridgeLat + 0.0005, bridgeLng - 0.001],
      ],
      {
        color: "#16a34a",
        fillColor: "#22c55e",
        fillOpacity: 0.7,
        weight: 2,
      }
    ).addTo(map);

    // Add Huajiang Bridge marker with custom icon
    const bridgeIcon = L.divIcon({
      className: "custom-icon",
      html: `
                        <div class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-teal-700" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 010 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd" />
                                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                            </svg>
                            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full animate-ping"></div>
                        </div>
                    `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const bridgeMarker = L.marker([bridgeLat, bridgeLng], {
      icon: bridgeIcon,
      riseOnHover: true,
    }).addTo(map);

    // Custom popup for the bridge
    bridgeMarker.bindPopup(`
                    <div class="custom-popup">
                        <h3 class="text-lg font-bold mb-2">Huajiang Bridge</h3>
                        <p class="mb-2">This critical infrastructure connects the western and eastern districts of Taipei across the Xindian River.</p>
                        <div class="flex items-center text-sm mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                            </svg>
                            <span>${bridgeLat.toFixed(
                              6
                            )}° N, ${bridgeLng.toFixed(6)}° E</span>
                        </div>
                        <button id="showDegradation" class="mt-3 px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700">
                            Show PET Degradation
                        </button>
                    </div>
                `);

    // Add urban areas
    const urbanArea = L.polygon(
      [
        [bridgeLat + 0.0045, bridgeLng - 0.005],
        [bridgeLat + 0.0045, bridgeLng + 0.005],
        [bridgeLat - 0.0075, bridgeLng + 0.005],
        [bridgeLat - 0.0075, bridgeLng - 0.005],
        [bridgeLat + 0.0045, bridgeLng - 0.005],
      ],
      {
        color: "#6b7280",
        fillColor: "#9ca3af",
        fillOpacity: 0.3,
        weight: 1,
        dashArray: "5,5",
      }
    ).addTo(map);

    // Add roads
    const mainRoad = L.polyline(
      [
        [bridgeLat + 0.0025, bridgeLng - 0.007],
        [bridgeLat + 0.0025, bridgeLng - 0.004],
        [bridgeLat + 0.0025, bridgeLng + 0.0035],
        [bridgeLat, bridgeLng + 0.005],
      ],
      {
        color: "#4b5563",
        weight: 4,
        opacity: 0.8,
      }
    ).addTo(map);

    // Zoom buttons functionality
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const mapContainer = document.querySelector(".map-container");

    zoomInBtn.addEventListener("click", function () {
      map.zoomIn();
      mapContainer.classList.add("zoomed");
      setTimeout(() => mapContainer.classList.remove("zoomed"), 300);
    });

    zoomOutBtn.addEventListener("click", function () {
      map.zoomOut();
      mapContainer.classList.add("zoomed");
      setTimeout(() => mapContainer.classList.remove("zoomed"), 300);
    });

    // Open bridge popup after a delay
    setTimeout(() => {
      bridgeMarker.openPopup();

      // Add event listener for the PET degradation button
      document
        .getElementById("showDegradation")
        ?.addEventListener("click", function () {
          const animationDiv = document.getElementById("degradationAnimation");
          animationDiv.style.display = "block";
          animatePETDegradation();

          // Scroll to the animation
          animationDiv.scrollIntoView({ behavior: "smooth" });
        });

      // Restart animation button
      document
        .getElementById("restartAnimation")
        ?.addEventListener("click", function () {
          animatePETDegradation();
        });
    }, 1500);
  }

  // PET Degradation Animation Function
  function animatePETDegradation() {
    // Reset all bonds
    document.querySelectorAll(".bond").forEach(b => b.classList.remove("broken"));

    // Reset TiO₂ particles
    for (let i = 1; i <= 2; i++) {
      const tio2 = document.getElementById(`tio2-${i}`);
      tio2.style.opacity = "0";
      tio2.style.left = `${Math.random() * 250}px`;
      tio2.style.top = `${30 + Math.random() * 40}px`;
      tio2.style.transition = "none";
    }

    // Animate TiO₂ particles appearing
    setTimeout(() => {
      for (let i = 1; i <= 2; i++) {
        const tio2 = document.getElementById(`tio2-${i}`);
        tio2.style.transition = "opacity 0.5s ease-in";
        tio2.style.opacity = "1";
      }
    }, 100);

    // Break bonds one by one
    setTimeout(
      () => document.getElementById("bond1").classList.add("broken"),
      1000
    );
    setTimeout(
      () => document.getElementById("bond3").classList.add("broken"),
      1500
    );
    setTimeout(
      () => document.getElementById("bond5").classList.add("broken"),
      2000
    );
    setTimeout(
      () => document.getElementById("bond2").classList.add("broken"),
      2500
    );
    setTimeout(
      () => document.getElementById("bond4").classList.add("broken"),
      3000
    );

    // Make TiO₂ particles move
    setTimeout(() => {
      for (let i = 1; i <= 2; i++) {
        const tio2 = document.getElementById(`tio2-${i}`);
        tio2.style.transition = "all 1.5s ease-in-out";
        tio2.style.left = "90px";
        tio2.style.top = "0px";
      }
    }, 500);

    // Reset radicals
    const radicals = ["radical-1", "radical-2"];
    radicals.forEach(id => {
      const r = document.getElementById(id);
      r.style.opacity = "0";
      r.style.left = "-20px";
      r.style.top = "3px";
      r.style.transition = "none";
    });

    // Animate radicals
    setTimeout(() => {
      const radical1 = document.getElementById("radical-1");
      const radical2 = document.getElementById("radical-2");
      radical1.style.opacity = "1";
      radical2.style.opacity = "1";
      radical1.style.left = "160px";
      radical2.style.left = "180px";
      radical1.style.top = "45px";
      radical2.style.top = "55px";
      radical1.style.transition = "all 1s ease-in-out";
      radical2.style.transition = "all 1s ease-in-out";
    }, 1000);
  }
});
