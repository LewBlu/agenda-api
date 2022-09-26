const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		AllowNull: false,
		primaryKey: true
	},
	username: {
		type: Sequelize.STRING,
		AllowNull: false
	},
	hashed_password: {
		type: Sequelize.BLOB,
		AllowNull: false
	},
	salt: {
		type: Sequelize.BLOB,
		AllowNull: false
	},
	firstname: {
		type: Sequelize.STRING
	},
	lastname: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING,
		AllowNull: false
	}
});

module.exports = User;