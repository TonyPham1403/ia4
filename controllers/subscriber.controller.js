const SubscriberModel = require('../models/subscriber.model');

const subscriberController = {
	add: async (req, res, next) => {
		try {
			const { email } = req.body;

			await SubscriberModel.add(email);
			req.flash('success', 'Thank you for support');
			res.redirect('/');
		} catch (err) {
			next(err);
		}
	},
};

module.exports = subscriberController;
