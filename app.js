const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utilities/database');

// Require routes
const projectRoutes = require('./routes/projects');

// Initialize api
const app = express();

// Parse the incoming data (json format expected)
app.use(bodyParser.json());

// Define routes
app.use('/projects',projectRoutes);

// Listen for requests
sequelize.sync().then(result => {
	app.listen(8080);
}).catch(err => console.log(err));