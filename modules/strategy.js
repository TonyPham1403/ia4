const passport = require('passport');
const { Strategy } = require('passport-strategy');

module.exports = class MyStrategy extends Strategy {
	constructor(verify, options) {
		super();
		this.name = 'myStrategy'; // Set a name for your strategy
		this.verify = verify; // Set the verify function for authentication
		// Any additional options or configuration can be handled here
		this.email = options && options.email ? options.email : 'email';
		this.password =
			options && options.password ? options.password : 'password';
		passport.strategies[this.name] = this; // Register the strategy with Passport
	}

	authenticate(req, options) {
		const { email, password } = req.body; // Assuming username and password are in request body
		// Validate username and password (You may replace this with your actual validation logic)
		if (!email || !password) {
			return this.fail('Missing email or password');
		}

		// Call your verify function to check credentials
		this.verify(email, password, (err, user) => {
			if (err) {
				return this.fail('Invalid username or password');
			}

			if (!user) {
				return this.fail('Invalid username or password');
			}

			// If authentication is successful, call this.success
			this.success(user, 'Authentication successful');
		});
	}
};
