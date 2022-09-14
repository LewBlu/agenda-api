const Project = require('../models/project');

// Get a list of all the projects
exports.getProjects = (req, res, next) => {
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
	Project.create(req.body).then(result => {
		return res.status(200).json({message: 'Created project successfully.', result: result});
	}).catch(err => next(err));
};