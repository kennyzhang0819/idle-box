let coins = 0;
let autoOpeners = 0;
const autoOpenerCost = 10;
let lastItem = null;

function openBox() {
    console.log("Opening box...");
    fetch('/inventory/open-box', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUserId })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Opened box:", data);
        lastItem = data;
        updateDisplay();
    })
    .catch(error => {
        console.error("Error opening box:", error);
    });
}

function buyAutoOpener() {
    if (coins >= autoOpenerCost) {
        coins -= autoOpenerCost;
        autoOpeners++;
        updateDisplay();
    }
}
