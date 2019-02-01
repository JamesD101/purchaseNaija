const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const ProductSchema = new Schema ({
    name: { type: String, required: true } ,
    price: { type: String, required: true },
    description: { type: String, required: true },
    // Product code
    productCode: { type: String},
    // description: { type: String, default: 'No Description' },
    imageUrl: { type: String, required: true },
    quantity: { type: String, required: true },
    productCategory: { type: String, required: true},
    createdAt: { type: Date },
    updatedAt: {type: Date }
});



module.exports = mongoose.model('Product', ProductSchema);