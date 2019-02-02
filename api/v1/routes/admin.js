const mongoose = require('mongoose');
const Products = require('../models/products');
const ServiceProvider = require('../models/serviceProvider');
const User = require('../models/user');
const Admin = require('../models/admin');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');
var randomstring = require("randomstring");

const multer = require('multer');

// set the directory for the uploads to the uploaded to
var DIR = './productImage';

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
// var upload = multer({dest: DIR}).single('file');

// adding the storage for the pictures to be stored in
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  DIR)
    },
    filename: function (req, file, cb) {
        var fileObj = {
            "image/png": ".png",
            "image/jpeg": ".jpeg"
            // "image/jpg": ".jpg"
        };
        if (fileObj[file.mimetype] == undefined) {
            cb(new Error("file format not valid"));
        } else {
            cb(null, file.fieldname + '-' + Date.now() + fileObj[file.mimetype])
        }
    }
});

var upload = multer({ storage: storage }).single('file');


module.exports = function(router){

    // register admin api
    router.post('/admin/signup', function (req, res) {
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
    router.post('/admin/login', function(req,res){
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
    router.post('/admin/registerStaff', function (req, res) {
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

    //Create Products

    /*router.post('/serviceProvider/products', function (req, res) {
        if (!req.body.name) {
            res.json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.json({success: false, message:'Product Category is required'});
                        } else {

                            var imagePath = '';

                            upload(req, res, function (err) {
                                if (err) {
                                    // An error occurred when uploading
                                    console.log(err);
                                    return res.status(422).send("an Error occured");
                                }
                                imagePath = req.file.filename;

                                let product = new Products({
                                    name: req.body.name,
                                    price: req.body.price,
                                    description: req.body.description,
                                    productCode: randomstring.generate(10),
                                    imageUrl: req.body.url,
                                    quantity: req.body.quantity,
                                    productCategory: req.body.productCategory,
                                    createdAt: Date.now(),
                                    updatedAt: Date.now()
                                });
                                product.save(function (err) {
                                    if (err) {
                                        res.json({success: false, message: 'An error occurred'});
                                    } else {
                                        res.json({success: true, message: 'Product has been created'});
                                    }
                                });
                            });
                        }

                    }
                }
            }
        }
    });


    //Update Product

    router.put('/serviceProvider/products/:id', function (req, res) {
        if (!req.body.name) {
            res.json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.json({success: false, message:'Product Category is required'});
                        } else {

                            var imagePath = '';

                            upload(req, res, function (err) {
                                if (err) {
                                    // An error occurred when uploading
                                    console.log(err);
                                    return res.status(422).send("an Error occured");
                                }
                                imagePath = req.file.filename;

                                Products.findByIdAndUpdate(req.params.id, {
                                    name: req.body.name,
                                    price: req.body.price,
                                    description: req.body.description,
                                    productCode: randomstring.generate(10),
                                    imageUrl: req.body.url,
                                    quantity: req.body.quantity,
                                    productCategory: req.body.productCategory,
                                    // createdAt: Date.now(),
                                    updatedAt: Date.now()
                                }, function (err) {
                                    if (err) {
                                        res.json({success: false, message: 'Product could not be updated'});
                                    } else {
                                        res.json({success: true, message: 'Product has been updated'});
                                    }
                                });
                            });
                        }

                    }
                }
            }
        }
    });*/

    //Delete product
    router.delete('/serviceProvider/products/:id', function (req,res) {
        Products.findByIdAndRemove({_id: req.params.id}).then(function (done) {
            if(done){
                res.json({success: true, message: 'Product was successfully deleted'});
            }  else {
                res.json({success: false, message:'An error occurred. Try again later.'});
            }
        });
    });

    return router;
};