const express = require('express');
const router = express.Router();

// Require Controllers
const projectsController = require('../controllers/projects');

// Project specific routes
router.get('/', projectsController.getProjects);
router.get('/:projectID', projectsController.getProjectByID);
router.post('/create', projectsController.createProject);

module.exports = router;