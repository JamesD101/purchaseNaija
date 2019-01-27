const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else {
        if (username.length < 10 || username.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

const validPasswordChecker = (password) => {
    if (!password){
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
}

const passwordLengthChecker = (password) => {
    if(!password){
        return false;
    } else {
        if (password.length < 3 || password.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

const passwordValidate = [
    {
        validator: passwordLengthChecker, message : 'Password must be between 3 and 50 characters'
    },
    {
        validator: validPasswordChecker, message: 'Password is invalid - Password must have a lowercase, uppercase letter, a symbol and atleast a number'
    }
];
const usernameValidate = [
    {
        validator: usernameLengthChecker, message : 'Username must be between 10 and 50 characters'
    }
];


const adminSchema = new Schema ({
    username: { type: String, required: true, unique: true, validate: usernameValidate } ,
    password: { type: String, required: true, validate: passwordValidate }
});

// hash the password
adminSchema.pre('save', function (next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
});

//compare password in the database
adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)  ;
};


module.exports = mongoose.model('admin', adminSchema);