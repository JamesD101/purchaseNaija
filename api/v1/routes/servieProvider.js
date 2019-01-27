const mongoose = require('mongoose');
const Staff = require('../models/serviceProvider');
const User = require('../models/user');
const ServiceProvider = require('../models/serviceProvider');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');

module.exports = function(router){


    // register admin api
    router.post('/api/v1/serviceProvider/signup', function (req, res) {
        if (!req.body.businessName) {
            res.json({success: false, message: 'Business Name is required'});
        } else {
            if (!req.body.email) {
                res.json({success: false, message: 'Email is required'});
            }else {
                if (!req.body.billingAddress) {
                    res.json({success: false, message: 'Billing Address is required'});
                } else {
                    if (!req.body.password) {
                        res.json({success: false, message: 'Password is required'});
                    } else {
                        if (!req.body.phoneNumber) {
                            res.json({success: false, message: 'Phone Number is required'});
                        } else {
                        var serviceProvider = new ServiceProvider({
                            businessName: req.body.businessName,
                            email: req.body.email,
                            billingAddress: req.body.billingAddress,
                            password: req.body.password,
                            phoneNumber: req.body.phoneNumber
                        });
                        serviceProvider.save(function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    res.json({success: false, message: 'Username already exists'});
                                } else {
                                    if (err.errors) {
                                        if (err.errors.businessName) {
                                            res.json({success: false, message: err.errors.businessName.message});
                                        } else {
                                            if (err.errors.password) {
                                                res.json({success: false, message: err.errors.password.message });
                                            } else {
                                                if (err.errors.email) {
                                                    res.json({success: false, message: err.errors.email.message });
                                                } else {
                                                    if (err.errors.phoneNumber) {
                                                        res.json({success: false, message: err.errors.phoneNumber.message})
                                                    } else {
                                                        res.json({success: false, message: err});
                                                    }
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
    });


    // logging api functionality
    router.post('/api/v1/serviceProvider/login', function(req,res){
        if (!req.body.businessName){
            res.json({ success: false, message: 'Business Name must be provided'});
        } else {
            if (!req.body.password){
                res.json({ success: false, message: 'No password was provided'});
            } else {
                ServiceProvider.findOne({ businessName: req.body.businessName}, function (err,serviceProvider) {
                    if (err){
                        res.json({ success: false, message: 'An error occurred'});
                    } else {
                        if (!serviceProvider){
                            res.json({ success: false, message: 'User was not found.'});
                        } else {
                            const validPassword = serviceProvider.comparePassword(req.body.password);
                            if (!validPassword){
                                res.json ({ success: false, message: 'Password was invalid' });
                            } else {
                                const token = jwt.sign({ staffId: serviceProvider._id}, config.secretKey, {expiresIn: '5h'});
                                res.json({ success: true, message: 'Success!', token: token, serviceProvider: {
                                        id: serviceProvider._id
                                }});
                            }
                        }
                    }
                });
            }
        }
    });

    return router;
};