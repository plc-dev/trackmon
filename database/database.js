
module.exports = async () => {
	try {
		const Sequelize = require("sequelize");

		// Setup Connection
		const sequelize = new Sequelize(process.env.db, process.env.dbUser, process.env.dbPass, {
			host: process.env.dbHost,
			dialect: "postgres",
			protocol: "postgres",
			logging: false,
			dialectOptions: {
				ssl: true
			},

			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000
			}
		});

		// test connection
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');

		// Connect all models to one object for better accessibility
		const db = {};

		db.sequelize = sequelize;
		db.Sequelize = Sequelize;

		// Models/Tabels
		db.Expense = require('./model/Expense')(sequelize, Sequelize);

		// Create table if not exist 
		await sequelize.sync({ force: false })
		console.log(`Tables have been initialized!`);
		return db;
	} catch (err) {
		console.log(err);
	}
};