const express = require('express');
const router = express.Router();

// Require Controllers
const projectsController = require('../controllers/projects');

// Project specific routes
router.get('/', projectsController.getProjects);
router.get('/create', projectsController.createProject);

module.exports = router;