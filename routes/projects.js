const express = require('express');
const router = express.Router();

// Require Controllers
const projectsController = require('../controllers/projects');


// Project specific routes
router.use('/', projectsController.getProjects);

module.exports = router;