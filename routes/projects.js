const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Require Controllers
const projectsController = require('../controllers/projects');

// Project specific routes
router.get('/', projectsController.getProjects);
router.get('/:projectID', projectsController.getProjectByID);
router.post('/create',[
	body('title').trim().isLength({min: 3})
], projectsController.createProject);

module.exports = router;