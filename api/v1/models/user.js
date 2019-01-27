const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const emailLengthChecker = (email) => {
    if(!email){
        return false;
    } else {
        if (email.length < 3 || email.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

const validEmailChecker = (email) => {
    if (!email){
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
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

const validPhone = (phoneNumber) => {
    if (!phoneNumber){
        return false;
    } else {
        const regExp = new RegExp(/^\d+$/);
        return regExp.test(phoneNumber);
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
const emailValidate = [
    {
        validator: emailLengthChecker, message : 'Email must be between 3 and 50 characters'
    },
    {
        validator: validEmailChecker, message: 'Email is invalid'
    }
];

const phoneNumberValidate = [
    {
        validator: validPhone, message : 'Phone number must contain only numbers/digits'
    }
];

const UserSchema = new Schema ({
    email: { type: String, required: true, unique: true, validate: emailValidate } ,
    password: { type: String, required: true, validate: passwordValidate },
    firstname: { type: String, required: true } ,
    lastname: { type: String, required: true },
    billingAddress1: { type: String, required: true },
    billingAddress2: { type: String},
    phoneNumber: { type: String, validate: phoneNumberValidate }
});

// hash the password
UserSchema.pre('save', function (next) {
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
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)  ;
};


module.exports = mongoose.model('User', UserSchema);