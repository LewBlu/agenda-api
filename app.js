const express = require('express');
const sequelize = require('./utilities/database');

// Require routes
const projectRoutes = require('./routes/projects');

// Initialize api
const app = express();

app.use('/projects',projectRoutes);

// Listen for requests
sequelize.sync().then(result => {
	app.listen(8080);
}).catch(err => console.log(err));