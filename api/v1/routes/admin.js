const mongoose = require('mongoose');
const Staff = require('../models/serviceProvider');
const User = require('../models/user');
const Admin = require('../models/admin');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');

module.exports = function(router){

    // register admin api
    router.post('/api/v1/admin/signup', function (req, res) {
        if (!req.body.username) {
            res.json({success: false, message: 'Username is required'});
        } else {
            if (!req.body.password) {
                res.json({success: false, message: 'Password is required'});
            }
            else {
                var admin = new Admin({
                    username: req.body.username,
                    password: req.body.password
                });
                admin.save(function (err) {
                    if (err) {
                        if (err.code === 11000) {
                            res.json({success: false, message: 'Username already exists'});
                        } else {
                            if (err.errors) {
                                if (err.errors.username) {
                                    res.json({success: false, message: err.errors.username.message });
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
    });

    // logging api functionality
    router.post('/api/v1/admin/login', function(req,res){
        if (!req.body.username){
            res.json({ success: false, message: 'Username must be provided'});
        } else {
            if (!req.body.password){
                res.json({ success: false, message: 'No password was provided'});
            } else {
                Admin.findOne({ username: req.body.username}, function (err,admin) {
                    if (err){
                        res.json({ success: false, message: 'An error occurred'});
                    } else {
                        if (!admin){
                            res.json({ success: false, message: 'User was not found.'});
                        } else {
                            const validPassword = admin.comparePassword(req.body.password);
                            if (!validPassword){
                                res.json ({ success: false, message: 'Password was invalid' });
                            } else {
                                const token = jwt.sign({ adminId: admin._id}, config.secretKey, {expiresIn: '5h'});
                                res.json({ success: true, message: 'Success!', token: token, admin: {
                                        username: admin.username
                                    }});
                            }
                        }
                    }
                });
            }
        }
    });



    // register staff api
    router.post('/api/v1/admin/registerStaff', function (req, res) {
        if (!req.body.username) {
            res.json({success: false, message: 'Username is required'});
        } else {
            if (!req.body.password) {
                res.json({success: false, message: 'Password is required'});
            }
            else {
                var staff = new Staff({
                    username: req.body.username,
                    password: req.body.password
                });
                staff.save(function (err) {
                    if (err) {
                        if (err.code === 11000) {
                            res.json({success: false, message: 'Username already exists'});
                        } else {
                            if (err.errors) {
                                if (err.errors.username) {
                                    res.json({success: false, message: err.errors.username.message });
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
    });

    return router;
};