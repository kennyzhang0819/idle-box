const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: Number
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
