const inventoryContainer = document.getElementById("inventory");
const btn = document.getElementById("btn");
const reader = new Html5Qrcode("camera");
let scannerOn = false;

function toggleScanner() {
    scannerOn = !scannerOn;
    if (scannerOn) {
        startScanner();
        btn.innerText = "CANCEL";
    } else {
        stopScanner();
        btn.innerText = "SCAN";
    }
}

function startScanner() {
    reader.start(
        { facingMode: "environment" },
        {},
        function (text) {
            try {
                const product = JSON.parse(text);
                displayItem(product);
                toggleScanner(); // stop after one scan
            } catch (err) {
                console.error("Invalid QR code data:", err);
            }
        }
    ).catch(err => console.error("Scanner error:", err));
}

function stopScanner() {
    reader.stop().catch(err => console.error(err));
}

function displayItem(product) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
        <p><strong>Name:</strong> ${product.name}</p>
        <p><strong>In Store:</strong> ${product.in_store ? "Yes" : "No"}</p>
        <p><strong>Price:</strong> €${product.price.toFixed(2)}</p>
    `;
    inventoryContainer.appendChild(div);
}
