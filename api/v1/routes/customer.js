const mongoose = require('mongoose');
const User = require('../models/user');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');

module.exports = function(router){

    // register api
    router.post('/user/signup', function (req, res) {
        if (!req.body.email) {
            res.json({success: false, message: 'Email is required'});
        } else {
            if (!req.body.password) {
                res.json({success: false, message: 'Password is required'});
            } else {
                if (!req.body.firstname) {
                    res.json({success: false, message: 'First name is required'});
                } else {
                    if (!req.body.lastname) {
                        res.json({success: false, message: 'Last name is required'});
                    } else {
                        if (!req.body.billingAddress1) {
                            res.json({success: false, message: 'Billing address must be provided'});
                        } else {
                            if (!req.body.phoneNumber) {
                                res.json({success: false, message: 'Phone number is required'});
                            }
                            else {
                                var user = new User({
                                    email: req.body.email,
                                    password: req.body.password,
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    billingAddress1: req.body.billingAddress1,
                                    billingAddress2: req.body.billingAddress2,
                                    phoneNumber: req.body.phoneNumber
                                });
                                user.save(function (err) {
                                    if (err) {
                                        if (err.code === 11000) {
                                            res.json({success: false, message: 'E-mail already exists'});
                                        } else {
                                            if (err.errors) {
                                                if (err.errors.email) {
                                                    res.json({success: false, message: err.errors.email.message });
                                                } else {
                                                    if (err.errors.phoneNumber) {
                                                        res.json({
                                                            success: false,
                                                            message: err.errors.phoneNumber.message
                                                        });
                                                    } else {
                                                        if (err.errors.password) {
                                                            res.json({
                                                                success: false,
                                                                message: err.errors.password.message
                                                            });
                                                        } else {
                                                            res.json({ success: false, message: err });
                                                        }
                                                    }
                                                }
                                            } else {
                                                res.json({success: false, message: 'Could not create user'});
                                            }
                                        }
                                    } else {
                                        res.json({success: true, message: 'Account Created'});
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });


    // logging api functionality
    router.post('/user/login', function(req,res){
        if (!req.body.email){
            res.json({ success: false, message: 'Email must be provided'});
        } else {
            if (!req.body.password){
                res.json({ success: false, message: 'No password was provided'});
            } else {
                User.findOne({ email: req.body.email}, function (err,user) {
                    if (err){
                        res.json({ success: false, message: 'An error occurred'});
                    } else {
                        if (!user){
                            res.json({ success: false, message: 'User was not found.'});
                        } else {
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword){
                                res.json ({ success: false, message: 'Password was invalid' });
                            } else {
                                const token = jwt.sign({ userId: user._id}, config.secretKey, {expiresIn: '5h'});
                                res.json({ success: true, message: 'Success!', token: token, user: {
                                        id: user._id
                                    }});
                            }
                        }
                    }
                });
            }
        }
    });

    //Customer update information functionality

    router.put('/user/update/:id', function (req, res) {
        if (!req.body.email) {
            res.json({success: false, message: 'Email is required'});
        } else {
            if (!req.body.password) {
                res.json({success: false, message: 'Password is required'});
            } else {
                if (!req.body.firstname) {
                    res.json({success: false, message: 'First name is required'});
                } else {
                    if (!req.body.lastname) {
                        res.json({success: false, message: 'Last name is required'});
                    } else {
                        if (!req.body.billingAddress1) {
                            res.json({success: false, message: 'Billing address must be provided'});
                        } else {
                            if (!req.body.phoneNumber) {
                                res.json({success: false, message: 'Phone number is required'});
                            }
                            else {
                                User.findByIdAndUpdate(req.params.id, {
                                    email: req.body.email,
                                    password: req.body.password,
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    billingAddress1: req.body.billingAddress1,

                                    // I am not sure if users would be updating all information so I didn't add this

                                    // billingAddress2: req.body.billingAddress2,

                                    phoneNumber: req.body.phoneNumber

                                }, function (err) {
                                    if (err) {
                                        res.json({success: false, message: 'User Information could not be updated'});
                                    } else {
                                        res.json({success: true, message: 'User Information Updated'});
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });

    //API to get a particular user

    router.get('/user/:id', function (req, res) {
        User.findOne({ id: req.params.id}, function (err, user) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!user) {
                    res.json({success: false, message: 'User was not found'});
                } else {
                    res.json({ success: false, user: user});
                }
            }
        }) ;
    });

    return router;
};