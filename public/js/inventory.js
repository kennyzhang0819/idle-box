function sellSelectedItem() {
    const itemToSellName = document.getElementById('itemToSell').value;
    const quantityToSell = parseInt(document.getElementById('sellQuantity').value, 10);

    const itemToSell = possibleItems.find(item => item.name === itemToSellName);
    if (!itemToSell || isNaN(quantityToSell) || quantityToSell <= 0) {
        alert("Please select a valid item and quantity to sell.");
        return;
    }

    fetch('/inventory/sell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId: itemToSell._id, quantity: quantityToSell })
    })
    .then(response => response.json())
    .then(data => {
        coins += data.coinsEarned;
        updateDisplay();
    })
    .catch(error => {
        console.error("Error selling item:", error);
    });
}


