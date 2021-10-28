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

router.get('/messageTest', async (req, res) => {
	await bot.messageSubsOf('christian.meinke@bsu-projekt-service.de', 'Christian Meinke hat ein neues Projekt erstellt');
	res.end();
});

module.exports = router;
