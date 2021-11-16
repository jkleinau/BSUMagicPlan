const express = require('express');
const Plan = require('../models/plan');
const Subscriber = require('../models/subscriber');
const fetch = require('node-fetch');
const bot = require('../utils/TelegramBot');

const router = express.Router();
// const bot = new TelegramBot('2089887792:AAEoZEZwKfQUH-7DrPQFa-D9jdzocCcmAe4');

router.get('/config', async (req, res) => {
	const messages = await bot.recieveMessages();
	await bot.checkForNewUsers();
	await bot.loadSubs();
	const publishers = await Plan.find().distinct('created_by.email');
	// const chats = await bot.getAllChatIDs();
	// await bot.messageSubsOf('first');
	// console.log(chats);
	const subscribers = await Subscriber.find().exec();

	res.render('telegram/index', { subscribers: subscribers, publishers: publishers });
});

router.post('/config', async (req, res) => {
	let subs = {};
	// console.log(`req.body`, req.body);
	for (const [key, value] of Object.entries(req.body)) {
		const [sub, pub] = key.split(':');
		if (!subs[sub]) {
			subs[sub] = [];
		}
		if (value.includes('yes')) {
			subs[sub].push(pub);
		}
	}
	// console.log(JSON.stringify(subs, null, 4));
	for (const [chat_id, subscribed_to] of Object.entries(subs)) {
		await Subscriber.updateOne({ chat_id: chat_id }, { $set: { subscribed_to: subscribed_to } });
	}
	// console.log(JSON.stringify(subs, null, 4));
	res.redirect('/telegram/config');
});

router.get('/messageTest', async (req, res) => {
	await bot.messageSubsOf('christian.meinke@bsu-projekt-service.de', 'Christian Meinke hat ein neues Projekt erstellt');
	res.end();
});

module.exports = router;
