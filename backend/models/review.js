const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId: String,
    customerName: String,
    star: Number,
    comment: String
}, { collection : 'reviews' });

module.exports = mongoose.model('review', reviewSchema);