let qrScanner;

function toggleScanner() {
    const cameraDiv = document.getElementById('camera');
    const mapContainer = document.getElementById('mapContainer');
    const tableBody = document.querySelector("#inventoryTable tbody");
    const marker = document.getElementById('marker');
    const mapImg = document.getElementById('map');

    // Show camera, hide map
    cameraDiv.style.display = "block";
    mapContainer.style.display = "none";

    if (!qrScanner) {
        qrScanner = new Html5Qrcode("camera");
        qrScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText, decodedResult) => {
                console.log("QR Scanned:", decodedText);

                qrScanner.stop().then(() => {
                    cameraDiv.style.display = "none";
                    mapContainer.style.display = "block";

                    try {
                        const data = JSON.parse(decodedText);

                        // Clear previous table rows
                        tableBody.innerHTML = "";

                        // Add new row
                        const row = document.createElement("tr");

                        const nameCell = document.createElement("td");
                        nameCell.textContent = data.name;

                        const latCell = document.createElement("td");
                        latCell.textContent = data.latitude;

                        const lonCell = document.createElement("td");
                        lonCell.textContent = data.longitude;

                        row.appendChild(nameCell);
                        row.appendChild(latCell);
                        row.appendChild(lonCell);

                        tableBody.appendChild(row);

                        // Place marker based on latitude/longitude
                        if (data.latitude !== undefined && data.longitude !== undefined) {
                            const pos = latLonToPixels(data.latitude, data.longitude, mapImg.width, mapImg.height);
                            marker.style.top = pos.y + "px";
                            marker.style.left = pos.x + "px";
                        }

                    } catch (err) {
                        console.error("Invalid JSON:", err);
                        tableBody.innerHTML = `<tr><td colspan="3">QR code does not contain valid data.</td></tr>`;
                    }

                }).catch(err => console.error("Failed to stop scanner:", err));
            },
            (errorMessage) => { /* ignore frames with no QR */ }
        ).catch(err => console.error("Unable to start scanner:", err));
    }
}

// Convert latitude/longitude to pixel coordinates on map
function latLonToPixels(lat, lon, mapWidth, mapHeight) {
    // Replace these with your map's actual bounds
    const latTop = 63.0;
    const latBottom = 62.0;
    const lonLeft = 29.0;
    const lonRight = 30.0;

    const x = ((lon - lonLeft) / (lonRight - lonLeft)) * mapWidth;
    const y = ((latTop - lat) / (latTop - latBottom)) * mapHeight;

    return { x, y };
}
