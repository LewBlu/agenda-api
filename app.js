const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const sequelize = require('./utilities/database');
const passport = require('passport');
const session = require('express-session');
const crypto = require('crypto');
const LocalStrategy = require('passport-local');
const MySQLStore = require('express-mysql-session')(session);

// Database credentials (Used for session)
const db_options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Required Models
const User = require('./models/user');

// Require routes
const projectRoutes = require('./routes/projects');
const { nextTick } = require('process');

// Initialize application
const app = express();

// Parse the incoming data for use in middlewares (json format expected)
app.use(bodyParser.json());

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	store: new MySQLStore(db_options)
}));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

/* -------------------------------------------------------------------------- */
/*                               User Serializer                              */
/* -------------------------------------------------------------------------- */

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// Local Strategy
passport.use(new LocalStrategy((username, password, callback) => {
	console.log('here');
	User.findOne({ username: 'lewis'}).then(result => {
		if (!result.length) { return callback(null, false, { message: 'Incorrect username or password.' }); }
		crypto.pbkdf2('password', result[0].salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return callback(err); }
            if (!crypto.timingSafeEqual(result[0].hashed_password, hashedPassword)) {
                return callback(null, false, { message: 'Incorrect username or password.' });
            }
            return callback(null, result[0]);
        });
	}).catch(err => nextTick(err));
}));

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
// Prepare auth check for routes
const auth = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json("not authenticated!");
}

// Route for submitting login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home2',
    failureRedirect: '/login2'
}));

// Route for creating a user
app.post('/signup', (req, res, next) => {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2('password', salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) { return next(err); }
		User.create({username: 'lewis', hashed_password: hashedPassword, salt: salt}).then(result => {
			let user = {
                id: result.id,
                username: result.username
            };
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.redirect('/home');
            });
		}).catch(err => console.log(err));
    });
});

// Define routes
app.use('/projects',projectRoutes);

// Listen for requests
sequelize.sync().then(result => {
	app.listen(8080);
}).catch(err => console.log(err));