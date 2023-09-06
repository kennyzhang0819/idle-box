const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemId: { type: Number, required: true, unique: true },
    name: String,
    probability: Number,
    sellPrice: Number
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
