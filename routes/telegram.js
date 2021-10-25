const express = require('express');
const Plan = require('../models/plan');
const Subscriber = require('../models/subscriber');
const fetch = require('node-fetch');
let TelegramBot = require('../utils/TelegramBot');

const router = express.Router();
const bot = new TelegramBot('2089887792:AAEoZEZwKfQUH-7DrPQFa-D9jdzocCcmAe4', { first: ['1035328671', '2095403796'] });

router.get('/config', async (req, res) => {
	const messages = await bot.recieveMessages();
	await bot.checkForNewUsers();
	const creators = await Plan.find().distinct('created_by.email');
	// const chats = await bot.getAllChatIDs();
	// await bot.messageSubsOf('first');
	// console.log(chats);
	const subscribers = await Subscriber.find().exec();

	res.render('telegram/index', { subscribers: subscribers, creators: creators });
});

module.exports = router;
