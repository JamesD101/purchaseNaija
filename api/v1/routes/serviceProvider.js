const mongoose = require('mongoose');
const User = require('../models/user');
const Products = require('../models/products');
const ServiceProvider = require('../models/serviceProvider');
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


    // register SP api
    router.post('/serviceProvider/signup', function (req, res) {
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
    router.post('/serviceProvider/login', function(req,res){
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

    //Update user information

    router.put('/serviceProvider/:id', function (req, res) {
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
                            ServiceProvider.findByIdAndUpdate(req.params.id, {
                                businessName: req.body.businessName,
                                email: req.body.email,
                                billingAddress: req.body.billingAddress,
                                password: req.body.password,
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

    router.post('/serviceProvider/products', function (req, res) {
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

/*
                           var imagePath = '';

                           upload(req, res, function (err) {
                               if (err) {
                                   // An error occurred when uploading
                                   console.log(err);
                                   return res.status(422).send("an Error occured");
                               }*/
                               // imagePath = req.file.filename;


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
                                       res.json({success: false, message: 'An error occurred', error: err});
                                   } else {
                                       res.json({success: true, message: 'Product has been created'});
                                   }
                               });
                           // });
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

                            /*upload(req, res, function (err) {
                                if (err) {
                                    // An error occurred when uploading
                                    console.log(err);
                                    return res.status(422).send("an Error occured");
                                }
                                imagePath = req.file.filename;*/

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
                            // });
                        }

                    }
                }
            }
        }
    });

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