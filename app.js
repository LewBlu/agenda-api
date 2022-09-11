const express = require('express');

// Require routes
const projectRoutes = require('./routes/projects');


// Initialize api
const app = express();

app.use('/projects',projectRoutes);

// Listen for requests
app.listen(8080);