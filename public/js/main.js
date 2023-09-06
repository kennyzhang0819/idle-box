async function updateDisplay() {
    const [inventoryResponse, itemsResponse] = await Promise.all([
        fetch('/inventory', { method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUserId }) }),
        fetch('/items')
    ]);
    
    const inventoryData = await inventoryResponse.json();
    const itemsData = await itemsResponse.json();

    document.getElementById('coinCount').textContent = coins;  // Assuming 'coins' is still a local variable
    document.getElementById('lastItem').textContent = lastItem ? lastItem.name : 'None';

    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = '';

    for (let item of inventoryData) {
        const li = document.createElement('li');
        li.textContent = `${item.itemId.name}: ${item.quantity}`;
        inventoryList.appendChild(li);
    }
    
    const itemToSellDropdown = document.getElementById('itemToSell');
    itemToSellDropdown.innerHTML = '';

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

let currentUserId = null;

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.userId) {
            currentUserId = data.userId;
            alert('Logged in successfully!');
            updateDisplay();
            // Optionally: hide login/register forms and show game UI
        } else {
            alert(data.message || 'Error logging in.');
        }
    })
    .catch(error => {
        console.error("Error logging in:", error);
    });
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered successfully.') {
            alert('Registered successfully! Please login.');
            // Optionally: switch to the login form
        } else {
            alert(data.message || 'Error registering.');
        }
    })
    .catch(error => {
        console.error("Error registering:", error);
    });
}


document.addEventListener('DOMContentLoaded', (event) => {
    updateDisplay();
});