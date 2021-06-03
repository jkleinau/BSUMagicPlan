const mongoose = require('mongoose');
const plan = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	address: {
		street: {
			type: String,
		},
		street_number: {
			type: String,
		},
		postal_code: {
			type: String,
		},
		city: {
			type: String,
		},
		country: {
			type: String,
		},
		longitude: {
			type: Number,
		},
		latitude: {
			type: Number,
		},
	},
	creation_date: {
		type: Date,
		required: true,
	},
	update_date: {
		type: Date,
		required: true,
	},
	created_by: {
		id: {
			type: String,
		},
		firstname: {
			type: String,
		},
		lastname: {
			type: String,
		},
		email: {
			type: String,
		},
	},
	thumbnail_url: {
		type: String,
	},
	public_url: {
		type: String,
	},
	xml_file: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Plan', plan);
