const express = require('express');
const fetch = require('node-fetch');

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
	return await fetch(`https://api.telegram.org/bot${apiKey}/getUpdates`, {
		method: 'GET',
	});
}

router.get('/', async (req, res) => {
	console.log('here');
	const data = await recieveMessages.json();
	console.log(JSON.stringify(data, 2));
	res.send('Hello World');
});

module.exports = router;
