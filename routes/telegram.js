const express = require('express');
const fetch = require('node-fetch');
const Subscriber = require('../models/subscriber');

const router = express.Router();
const apiKey = '2089887792:AAEoZEZwKfQUH-7DrPQFa-D9jdzocCcmAe4';

async function sendMessage(recipient, message) {
	await fetch(`https://api.telegram.org/bot${apiKey}/sendMessage`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
		body: {
			text: message,
			chat_id: recipient,
		},
	});
}

async function recieveMessages() {
	const response = await fetch(`https://api.telegram.org/bot${apiKey}/getUpdates`, {
		method: 'GET',
	});
	const data = await response.json();
	return data;
}
router.get('/config', async (req, res) => {
	const subscribers = await Subscriber.find().exec();
	res.render('telegram/index', { subscribers: subscribers });
});

module.exports = router;
