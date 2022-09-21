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
	},
	salt: {
		type: Sequelize.BLOB
	},
	firstname: {
		type: Sequelize.STRING
	},
	lastname: {
		type: Sequelize.STRING
	}
});

module.exports = User;