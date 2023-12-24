const passport = require('passport');
const bcrypt = require('bcrypt');
const AdminModel = require('../models/admin.model');
const CustomerModel = require('../models/customer.model');
const MyStrategy = require('./strategy');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser(async (user, done) => {
	done(null, user);
});

module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(
		new MyStrategy(async (email, password, done) => {
			try {
				const user = await AdminModel.get(email);
				const rs = await bcrypt.compare(password, user.password);
				if (rs) {
					return done(null, user);
				}
				done('Invalid authentication', null);
			} catch (error) {
				done(error);
			}
		})
	);

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
				passReqToCallback: true,
			},
			async (request, accessToken, refreshToken, profile, done) => {
				try {
					// Check if the user already exists in your database
					const foundUser = await CustomerModel.getSocial(profile.id);
					if (foundUser) {
						return done(null, foundUser);
					}
					// If the user doesn't exist, create a new user using Google profile data
					const rs = await CustomerModel.addSocial(
						profile.email,
						//profile.picture,
						//profile.provider,
						//profile.id
					);
					if (rs.status) {
						// If user added successfully, retrieve the added user and pass it to done
						const newUser = await CustomerModel.getSocial(
							profile.id
						);
						return done(null, newUser);
					}
					done('Invalid authentication', null);
				} catch (err) {
					return done(err);
				}
			}
		)
	);

};
