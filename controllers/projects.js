const Project = require('../models/project');
const { validationResult } = require('express-validator');

// Get a list of all the projects
exports.getProjects = (req, res, next) => {
	if(!req.isAuthenticated()) {
		return res.status(401).json({message: 'User not logged in'});
	}
	Project.findAll().then(result => {
		return res.status(200).json({message: 'Fetched projects successfully.', result: result});
	}).catch(err => next(err));
};

// Fetch a specific project based on the ID of the project
exports.getProjectByID = (req, res, next) => {
	const projectID = req.params.projectID;
	Project.findByPk(projectID).then(result => {
		return res.status(200).json({message: 'Fetched project successfully.', result: result});
	}).catch(err => next(err));
};

// Create a project
exports.createProject = (req, res, next) => {
	const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
	Project.create(req.body).then(result => {
		return res.status(200).json({message: 'Created project successfully.', result: result});
	}).catch(err => next(err));
};