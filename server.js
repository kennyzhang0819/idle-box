const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const Item = require('./models/itemSchema');
const Inventory = require('./models/inventorySchema');

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/idleBoxOpener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

// API Endpoints
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/items', async (req, res) => {
    const itemsToInsert = req.body;

    for (let item of itemsToInsert) {
        if (!item.itemId || !item.name || !item.probability || !item.sellPrice) {
            return res.status(400).json({ message: "One or more items are missing necessary fields." });
        }
    }

    try {
        const insertedItems = await Item.insertMany(itemsToInsert);
        res.status(201).json(insertedItems);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/inventory', async (req, res) => {
    try {
        const inventory = await Inventory.find().populate('itemId');
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function getRandomItemFromDB() {
    try {
        const items = await Item.find();

        // Calculate the total sum of probabilities for normalization
        const totalProbability = items.reduce((sum, item) => sum + item.probability, 0);

        // Get a random number between 0 and totalProbability
        const randomNumber = Math.random() * totalProbability;
        let cumulativeProbability = 0;

        // Find the item
        for (const item of items) {
            cumulativeProbability += item.probability;
            if (randomNumber <= cumulativeProbability) {
                return item;
            }
        }

        // Default to returning the last item if no match (this should technically never be hit if probabilities are set up correctly)
        return items[items.length - 1];

    } catch (error) {
        throw new Error("Error fetching items from database: " + error.message);
    }
}


app.post('/inventory/open-box', async (req, res) => {
    try {
        const randomItem = await getRandomItemFromDB();

        let inventoryItem = await Inventory.findOne({ itemId: randomItem._id });

        if (inventoryItem) {
            inventoryItem.quantity += 1;
            await inventoryItem.save();
        } else {
            const newInventoryItem = new Inventory({
                itemId: randomItem._id,
                quantity: 1
            });
            await newInventoryItem.save();
        }

        res.json(randomItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/inventory/sell', async (req, res) => {
    const itemId = req.body.itemId;
    const quantityToSell = req.body.quantity;

    try {
        const inventoryItem = await Inventory.findOne({ itemId: itemId });

        if (!inventoryItem || inventoryItem.quantity < quantityToSell) {
            res.status(400).json({ message: "Not enough items to sell." });
            return;
        }

        // Subtract quantity or remove the item if quantity becomes zero
        inventoryItem.quantity -= quantityToSell;
        if (inventoryItem.quantity === 0) {
            await Inventory.deleteOne({ _id: inventoryItem._id });
        } else {
            await inventoryItem.save();
        }

        const item = await Item.findById(itemId);
        const coinsEarned = item.sellPrice * quantityToSell;
        res.json({ coinsEarned: coinsEarned });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});