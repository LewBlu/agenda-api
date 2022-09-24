const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv').config();
const sequelize = require('./utilities/database');
const passport = require('passport');
const session = require('express-session');
const crypto = require('crypto');
const LocalStrategy = require('passport-local');
const MySQLStore = require('express-mysql-session')(session);
const { nextTick } = require('process');

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

// Initialize application
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL); // * allows all, or you can limit by domain
    res.setHeader('Access-Control-Allow-Methods', '*'); // Set which headers you want to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // These 2 are recommended
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie'); // Required to allow the returned cookie to be set
	res.setHeader('Access-Control-Allow-Credentials', 'true'); // Required to allow auth credentials
    next();
});

// Parse the incoming data for use in middlewares (json format expected)
app.use(bodyParser.json());

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	store: new MySQLStore(db_options),
	cookie: {
		path: "/",
		httpOnly: false,
		secure: true,
		sameSite: 'none',
		maxAge: 3600000 // Set cookie to last 1 hour
	}
}));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

/* -------------------------------------------------------------------------- */
/*                               User Serializer                              */
/* -------------------------------------------------------------------------- */

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// Local Strategy
passport.use(new LocalStrategy((username, password, callback) => {
	User.findOne({where: { username: username}}).then(result => {
		if (!result) { return callback(null, false, { message: 'Incorrect username or password.' }); }
		crypto.pbkdf2(password, result.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return callback(err); }
            if (!crypto.timingSafeEqual(result.hashed_password, hashedPassword)) {
                return callback(null, false, { message: 'Incorrect username or password.' });
            }
            return callback(null, result);
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
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
	(req, res) => {
		return res.status(200).json({success: 'true'});
	});

// Route for creating a user
app.post('/signup', (req, res, next) => {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) { return next(err); }
		User.create({username: req.body.username, hashed_password: hashedPassword, salt: salt, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email}).then(result => {
			let user = {
                id: result.id,
                username: result.username,
				firstname: result.firstname,
				lastname: result.lastname,
				email: result.email
            };
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.redirect('/home');
            });
		}).catch(err => console.log(err));
    });
});

app.get('/logout', function(req, res, next) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.status(200).json({message: 'User logged out.'});
	});
});

// Define routes
app.use('/projects',projectRoutes);

// Listen for requests
sequelize.sync().then(result => {
	const httpsOptions = {
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem')
	}
	const server = https.createServer(httpsOptions, app).listen(8080);
}).catch(err => console.log(err));