const reader = new Html5Qrcode("camera");
let scannerOn = false;

// Reference to the inventory div
const inventoryDiv = document.getElementById('inventory');

function toggleScanner() {
    scannerOn = !scannerOn;
    const mapContainer = document.getElementById('mapContainer');
    const btn = document.getElementById('btn');

    if (scannerOn) {
        startScanner();
        mapContainer.style.display = "none";
        btn.innerText = "CANCEL";
    } else {
        stopScanner();
        mapContainer.style.display = "block";
        btn.innerText = "SCAN";
    }
}

function startScanner() {
    reader.start(
        { facingMode: "environment" },
        {},
        function (text) { // single callback
            try {
                const data = JSON.parse(text);

                // Clear previous inventory info
                inventoryDiv.innerHTML = "";

                // Display inventory in <p> tags
                const nameP = document.createElement("p");
                nameP.textContent = "Name: " + data.name;

                const inStoreP = document.createElement("p");
                inStoreP.textContent = "In Store: " + (data.in_store ? "Yes" : "No");

                const priceP = document.createElement("p");
                priceP.textContent = "Price: €" + data.price;

                inventoryDiv.appendChild(nameP);
                inventoryDiv.appendChild(inStoreP);
                inventoryDiv.appendChild(priceP);

                // Show marker if QR has coordinates
                if (data.top && data.left) {
                    showMarkerAt(data.top, data.left);
                }

                // Stop scanner after successful scan
                toggleScanner(); // hide camera and show map

            } catch (err) {
                console.error("Invalid JSON in QR code:", err);
                inventoryDiv.textContent = "QR code does not contain valid inventory data.";
            }
        }
    ).catch(function (err) {
        console.error(err);
    });
}

function stopScanner() {
    reader.stop();
}

function showMarkerAt(top, left) {
    const marker = document.getElementById('marker');
    marker.style.top = top;
    marker.style.left = left;
}
