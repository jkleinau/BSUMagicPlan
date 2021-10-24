const express = require('express');
const fetch = require('node-fetch');
const Subscriber = require('../models/subscriber');
let TelegramBot = require('../utils/TelegramBot');

const router = express.Router();
const bot = new TelegramBot('2089887792:AAEoZEZwKfQUH-7DrPQFa-D9jdzocCcmAe4', { first: ['1035328671', '2095403796'] });

// async function sendMessage(recipient, message) {
// 	await fetch(`https://api.telegram.org/bot${apiKey}/sendMessage`, {
// 		method: 'GET',
// 		headers: {
// 			'content-type': 'application/json',
// 		},
// 		body: {
// 			text: message,
// 			chat_id: recipient,
// 		},
// 	});
// }

// async function recieveMessages() {
// 	const response = await fetch(`https://api.telegram.org/bot${apiKey}/getUpdates`, {
// 		method: 'GET',
// 	});
// 	const data = await response.json();
// 	return data;
// }

router.get('/config', async (req, res) => {
	const messages = await bot.recieveMessages();
	const chats = await bot.getAllChatIDs();
	// await bot.messageSubsOf('first');
	console.log(chats);
	const subscribers = await Subscriber.find().exec();

	res.render('telegram/index', { subscribers: subscribers, mes: messages });
});

module.exports = router;
