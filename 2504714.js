const reader = new Html5Qrcode("camera");
let scannerOn = false;

function toggleScanner() {
    scannerOn = !scannerOn;
    if (scannerOn) {
        startScanner();
        mapContainer.style.display = "none";
        btn.innerText = "CANCEL";
    } else {
        stopScanner();
        mapContainer.style.display = "block";
        btn.innerText = "SCAN";
        const inventoryDiv = document.getElementById('inventory');
    }
}

function startScanner() {
    reader.start(
        { facingMode: "environment" },
        {},
       function startScanner() {
    reader.start(
        { facingMode: "environment" },
        {},
        function (text) {
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

                
                if (data.top && data.left) {
                    showMarkerAt(data.top, data.left);
                }

                // Stop scanner after successful scan
                toggleScanner(); // this will hide camera and show map

            } catch (err) {
                console.error("Invalid JSON in QR code:", err);
                inventoryDiv.textContent = "QR code does not contain valid inventory data.";
            }
        }
    ).catch(function (err) {
        console.error(err);
    });
}
    ).catch(function (err) {
        console.error(err);
    });
}

function stopScanner() {
    reader.stop();
}

function showMarkerAt(top, left) {
    marker.style.top = top;
    marker.style.left = left;
}
