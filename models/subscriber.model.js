const db = require('./db');

const schema = 'subscribers';

const SubscriberModel = {
	add: async (email) => {
		try {
			await db.add(schema, {
				email: email,
			});
		} catch (err) {
			console.error(err);
		}
	},
	getAll: async () => {
		try {
			const subscribers = await db.getAll(schema);
			return subscribers;
		} catch (err) {
			console.error(err);
		}
	},
};

module.exports = SubscriberModel;
