let qrScanner;

function toggleScanner() {
    const cameraDiv = document.getElementById('camera');
    const mapContainer = document.getElementById('mapContainer');
    const inventoryDiv = document.getElementById('inventory');

    // show camera and hide map initially
    cameraDiv.style.display = "block";
    mapContainer.style.display = "none";

    if (!qrScanner) {
        qrScanner = new Html5Qrcode("camera");
        qrScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText, decodedResult) => {
                console.log("QR Scanned:", decodedText);

                // stop scanning
                qrScanner.stop().then(() => {
                    cameraDiv.style.display = "none";
                    mapContainer.style.display = "block";

                    try {
                        const data = JSON.parse(decodedText);

                        // Clear previous inventory info
                        inventoryDiv.innerHTML = "";

                        // Create <p> tags dynamically
                        const nameP = document.createElement("p");
                        nameP.textContent = "Name: " + data.name;

                        const inStoreP = document.createElement("p");
                        inStoreP.textContent = "In Store: " + (data.in_store ? "Yes" : "No");

                        const priceP = document.createElement("p");
                        priceP.textContent = "Price: €" + data.price;

                        inventoryDiv.appendChild(nameP);
                        inventoryDiv.appendChild(inStoreP);
                        inventoryDiv.appendChild(priceP);

                        // Show marker if coordinates exist
                        if (data.top && data.left) {
                            const marker = document.getElementById('marker');
                            marker.style.top = data.top;
                            marker.style.left = data.left;
                        }

                    } catch (err) {
                        console.error("Invalid JSON in QR code:", err);
                        inventoryDiv.textContent = "QR code does not contain valid inventory data.";
                    }

                }).catch(err => {
                    console.error("Failed to stop scanner:", err);
                });
            },
            (errorMessage) => {
                // ignore frames where QR code is not detected
            }
        ).catch(err => {
            console.error("Unable to start scanner:", err);
        });
    }
}