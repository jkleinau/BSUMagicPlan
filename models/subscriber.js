const mongoose = require('mongoose');
const subscriber = new mongoose.Schema({
	chat_id: {
		type: 'Number',
		unique: true,
	},
	first_name: {
		type: 'String',
	},
	last_name: {
		type: 'String',
	},
	subscribed_to: {
		type: ['String'],
	},
});

module.exports = mongoose.model('Subscriber', subscriber);
