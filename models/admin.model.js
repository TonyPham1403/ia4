const db = require('./db');
const schema = 'admins';

const AdminModel = {
	get: async (email) => {
		try {
			const admin = await db.get(schema, 'email', email);
			return admin;
		} catch (err) {
			console.error(err);
		}
	},
};

module.exports = AdminModel;
