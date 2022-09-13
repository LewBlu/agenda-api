const Project = require('../models/project');

// Get a list of all the projects
exports.getProjects = (req, res, next) => {
    Project.findAll().then(result => {
		return res.status(200).json({message: 'Fetched projects successfully.', result: result});
	}).catch(err => console.log(err));
};

exports.createProject = (req, res, next) => {
	Project.create({
		title: 'Project 1 SQL',
		description: 'Description for project one'
	}).then(result => {
		return res.status(200).json({message: 'Created project successfully.', result: result});
	}).catch(err => console.log(err));
};