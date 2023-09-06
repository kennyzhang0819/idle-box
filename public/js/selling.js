async function sellSelectedItem() {
    let possibleItems;
    try {
        const response = await fetch('/items');
        possibleItems = await response.json();
    } catch (error) {
        console.error("Error fetching items:", error);
        alert("Error fetching available items. Please try again.");
        return;
    }

    const itemToSellId = document.getElementById('itemToSell').value;
    const quantityToSell = parseInt(document.getElementById('sellQuantity').value, 10);

    const itemToSell = possibleItems.find(item => item._id === itemToSellId);
    
    if (!itemToSell || isNaN(quantityToSell) || quantityToSell <= 0) {
        alert("Please select a valid item and quantity to sell.");
        return;
    }

    fetch('/inventory/sell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUserId, itemId: itemToSell._id, quantity: quantityToSell })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        coins += data.coinsEarned;
        updateDisplay();
    })
    .catch(error => {
        console.error("Error selling item:", error);
        alert("Failed to sell the item. Please try again.");
    });
}
