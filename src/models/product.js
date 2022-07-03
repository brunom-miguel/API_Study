const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    }
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product