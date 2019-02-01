const express = require("express");

const secret = require('./config/secret');
//Set port number
const morgan = require('morgan');
const mongoose = require('mongoose');
var User = require('./models/user');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const router = express.Router();

var user = require('./routes/customer')(router);
var admin = require('./routes/admin')(router);
var serviceProvider = require('./routes/serviceProvider')(router);

// var userRoutes = require('./routes/user')(router);
// var ejsMate = require('ejs-mate');
// var flash = require('express-flash');
// var MongoStore = require('connect-mongo')(session);
// var passport = require('passport');

const app = express();

mongoose.connect(secret.database, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

//Middle ware
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded( { extended: true }));


app.use(user);
app.use(admin);
app.use(serviceProvider);

app.listen(secret.port, function (err) {
    if (err) throw err;
    console.log("Server is running " + secret.port);
});