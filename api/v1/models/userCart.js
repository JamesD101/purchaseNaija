const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userCartSchema = new Schema ({
    userEmail: { type: String, required: true } ,
    productID: { type: String},
    quantity: { type: String, required: true },
    status: { type: String, required: true }
});



module.exports = mongoose.model('userCart', userCartSchema);