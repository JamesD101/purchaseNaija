const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const reviewSchema = new Schema ({
    userEmail: { type: String, required: true } ,
    productID: { type: String, required: true },
    review: { type: String, required: true },
    numberOfStars: {type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('review', reviewSchema);