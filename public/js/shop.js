let coins = 0;
let autoOpeners = 0;
const autoOpenerCost = 10;
let lastItem = null;

function openBox() {
    fetch('/inventory/open-box', {
        method: 'POST'
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
