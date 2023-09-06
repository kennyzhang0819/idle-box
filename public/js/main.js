async function updateDisplay() {
    // Fetch current inventory and items
    const [inventoryResponse, itemsResponse] = await Promise.all([
        fetch('/inventory'),
        fetch('/items')
    ]);

    const inventoryData = await inventoryResponse.json();
    const itemsData = await itemsResponse.json();

    document.getElementById('coinCount').textContent = coins;  // Assuming 'coins' is still a local variable
    document.getElementById('lastItem').textContent = lastItem ? lastItem.name : 'None';

    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = ''; // Clear the existing inventory items

    for (let item of inventoryData) {
        const li = document.createElement('li');
        li.textContent = `${item.itemId.name}: ${item.quantity}`;
        inventoryList.appendChild(li);
    }
    
    const itemToSellDropdown = document.getElementById('itemToSell');
    itemToSellDropdown.innerHTML = ''; // Clear the existing options

    for (let item of itemsData) {
        const option = document.createElement('option');
        option.value = item._id;
        option.textContent = item.name;
        itemToSellDropdown.appendChild(option);
    }
}


// Auto opening logic
setInterval(() => {
    for (let i = 0; i < autoOpeners; i++) {
        openBox();
    }
    updateDisplay();
}, 10000);
