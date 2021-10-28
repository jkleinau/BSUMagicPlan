const fetch = require('node-fetch');
const Subscriber = require('../models/subscriber');

class TelegramBot {
	constructor(API_KEY) {
		this.API_KEY = API_KEY;
	}

	async sendMessage(recipient, message) {
		await fetch(`https://api.telegram.org/bot${this.API_KEY}/sendMessage`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				text: message,
				chat_id: recipient,
			}),
		});
	}

	async messageSubsOf(publisher, message) {
		this.subscribers.forEach(async (sub) => {
			if (sub.subscribed_to.includes(publisher)) {
				await this.sendMessage(sub.chat_id, message);
			}
		});
	}

	async recieveMessages() {
		const response = await fetch(`https://api.telegram.org/bot${this.API_KEY}/getUpdates`, {
			method: 'GET',
		});
		const data = await response.json();
		return data;
	}

	async getAllChatIDs() {
		const messages = await this.recieveMessages();
		const chats = messages['result'].map((chat) => {
			return chat['message']['chat']['id'];
		});
		const uniqueChats = new Set(chats);
		return uniqueChats;
	}

	async checkForNewUsers() {
		const messages = await this.recieveMessages();
		const chats = messages['result'].map((message) => {
			return message['message']['chat'];
		});
		const newChats = chats.map(async (chat) => {
			await Subscriber.countDocuments({ chat_id: chat.id }, async (err, count) => {
				if (err) {
					console.error(err);
				}
				if (count == 0) {
					await new Subscriber({ chat_id: chat.id, first_name: chat.first_name, last_name: chat.last_name }).save();
				}
			});
		});
	}

	async loadSubs() {
		this.subscribers = await Subscriber.find().exec();
	}
}
const bot = new TelegramBot('2089887792:AAEoZEZwKfQUH-7DrPQFa-D9jdzocCcmAe4');
// Object.freeze(bot);
module.exports = bot;
