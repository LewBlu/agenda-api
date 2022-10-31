const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const Project = sequelize.define('project', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		AllowNull: false,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING,
		AllowNull: false,
	},
	description: Sequelize.STRING,
	key: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = Project;