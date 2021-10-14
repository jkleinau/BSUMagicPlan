const mongoose = require('mongoose');
const subscriber = new mongoose.Schema({
	chat_id: {
		type: 'Number',
	},
	first_name: {
		type: 'String',
	},
	last_name: {
		type: 'String',
	},
	subscried_to: {
		type: ['String'],
	},
});

module.exports = mongoose.model('Subscriber', subscriber);
