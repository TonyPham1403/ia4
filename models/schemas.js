const { UUID } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const customer = new Schema({
	first_name: String,
	last_name: {
		type: String,
		default: null,
	},
	email: {
		type: String,
		unique: true,
	},
	password: String,
	phone: {
		type: String,
		default: null,
	},
	avatar: {
		type: String,
		default: null,
	},
	default_address: {
		type: Schema.Types.ObjectId,
		ref: 'addresses',
		default: null,
	},
	default_payment: {
		type: Schema.Types.ObjectId,
		ref: 'payments',
		default: null,
	},
	socialId: {
		type: String,
		default: null,
	},
	provider: {
		type: String,
		default: 'app',
	},
	created_at: { type: Date, default: Date.now },
	last_updated: { type: Date, default: Date.now },
});

const address = new Schema({
	customer_id: {
		type: Schema.Types.ObjectId,
		ref: 'customers',
		default: null,
	},
	name: {
		type: String,
		required: true,
		unique: true,
		required: true,
	},
	phone: {
		type: String,
		default: null,
		required: true,
	},
	address: {
		type: String,
		default: null,
		required: true,
	},
	created_at: { type: Date, default: Date.now, required: true },
	last_updated: { type: Date, default: Date.now, required: true },
});
const subscriber = new Schema({
	email: String,
	created_at: { type: Date, default: Date.now },
});

const admins = new Schema({
	first_name: String,
	last_name: {
		type: String,
		default: null,
	},
	email: {
		type: String,
		unique: true,
	},
	password: String,
});
const categories = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	thumbnail: String,
	created_at: { type: Date, default: Date.now, required: true },
	last_updated: { type: Date, default: Date.now, required: true },
});
const books = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	votes: Number,
	brief_des: String,
	full_des: { type: String, required: true },
	author_name: String,
	pages: Number,
	age: String,
	price: Number,
	vendor: String,
	language: String,
	published_at: { type: Date },
	thumbnail: String,
	inventory: Number,
	category_id: {
		type: Schema.Types.ObjectId,
		ref: 'categories',
		default: null,
	},
	discount_id: {
		type: Schema.Types.ObjectId,
		ref: 'discount_programs',
		default: null,
	},
	created_at: { type: Date, default: Date.now, required: true },
	last_updated: { type: Date, default: Date.now, required: true },
});

const carts = new Schema({
	customerId: {
		type: Schema.Types.ObjectId,
		ref: 'customers',
	},
	bookId: {
		type: Schema.Types.ObjectId,
		ref: 'books',
	},
	quantity: {
		type: Number,
		default: 0,
	},
});

module.exports = {
	admins: admins,
	customers: customer,
	subscribers: subscriber,
	categories: categories,
	books: books,
	addresses: address,
	carts: carts,
};
