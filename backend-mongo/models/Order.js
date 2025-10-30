const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [
{
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
qty: { type: Number, required: true }
}
],
total: { type: Number, required: true },
status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', OrderSchema);