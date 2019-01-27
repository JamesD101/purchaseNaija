const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else {
        if (username.length < 7 || username.length > 50){
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
        if (password.length < 6 || password.length > 50){
            return false;
        } else {
            return true;
        }
    }
}

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
        validator: passwordLengthChecker, message : 'Password must be between 6 and 50 characters'
    },
    {
        validator: validPasswordChecker, message: 'Password is invalid - Password must have a lowercase, uppercase letter, a symbol and atleast a number'
    }
];
const usernameValidate = [
    {
        validator: usernameLengthChecker, message : 'Username must be between 7 and 50 characters'
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

const serviceProviderSchema = new Schema ({
    businessName: { type: String, required: true, unique: true } ,
    email: { type: String, required: true, unique: true, validate: emailValidate } ,
    billingAddress: { type: String, required: true },
    phoneNumber: { type: String, validate: phoneNumberValidate },
    password: { type: String, required: true, validate: passwordValidate }
});

// hash the password
serviceProviderSchema.pre('save', function (next) {
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
serviceProviderSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)  ;
};


module.exports = mongoose.model('serviceProvider', serviceProviderSchema);