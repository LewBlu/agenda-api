const Sequalize = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequalize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{dialect: 'mysql'}
);

module.exports = sequelize;